const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const sharp = require("sharp");
const dotenv = require("dotenv");
dotenv.config();

/* ================= CONFIG ================= */

const REST_BASE = "https://api.linkedin.com/rest";
const V2_BASE = "https://api.linkedin.com/v2";

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "LinkedIn-Version": "202502",
  "X-Restli-Protocol-Version": "2.0.0",
  "Content-Type": "application/json",
});


const getLinkedInConfig = () => ({
  CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,
  SCOPES: "openid r_verify profile email w_member_social",
});

/* ================= OAUTH ================= */

function getAuthorizationUrl() {
  const c = getLinkedInConfig();
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${c.CLIENT_ID}&redirect_uri=${encodeURIComponent(
    c.REDIRECT_URI
  )}&scope=${encodeURIComponent(c.SCOPES)}`;
}

async function exchangeCodeForToken(code) {
  const c = getLinkedInConfig();
  try {
  const res = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      params: {
        grant_type: "authorization_code",
        code,
        client_id: c.CLIENT_ID,
        client_secret: c.CLIENT_SECRET,
        redirect_uri: c.REDIRECT_URI,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  console.log('Token response', res.data);
  return res.data.access_token;
} catch (err) {
  console.error('Error exchanging code for token:', err.response?.data || err.message);
  throw new Error("Failed to exchange code for token");
}
}

async function getLinkedInProfile(token) {
  const res = await axios.get(`${V2_BASE}/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    urn: `urn:li:person:${res.data.sub}`,
    firstName: res.data.given_name || res.data.name,
    lastName: res.data.family_name || "",
    profilePicture:
      res.data.picture ||
      `https://api.dicebear.com/7.x/avataaars/png?seed=${res.data.sub}`,
  };
}

/* ================= IMAGE HELPERS ================= */

async function getImageBuffer(img) {
  let input;

  if (img.startsWith("data:image")) {
    input = Buffer.from(img.split(",")[1], "base64");
  } else if (img.startsWith("http")) {
    const res = await axios.get(img, {
      responseType: "arraybuffer",
      timeout: 10000,
    });
    input = Buffer.from(res.data);
  } else {
    input = fs.readFileSync(path.resolve(img));
  }

  return sharp(input)
    .rotate()
    .resize(1080, 1080, { fit: "cover" })
    .toColorspace("srgb")
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/* ================= IMAGE POST ================= */

async function uploadImage(imageBuffer, token, authorUrn) {
  const init = await axios.post(
    `${REST_BASE}/images?action=initializeUpload`,
    { initializeUploadRequest: { owner: authorUrn } },
    { headers: getHeaders(token) }
  );

  const v = init.data?.value;
  if (!v?.uploadUrl || !v?.image) {
    throw new Error("Image init failed");
  }

  await axios.put(v.uploadUrl, imageBuffer, {
    headers: { "Content-Type": "image/png" },
    maxBodyLength: Infinity,
  });

  return v.image;
}

async function createImagePost(text, imageUrn, token, authorUrn) {
  return axios.post(
    `${REST_BASE}/posts`,
    {
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED" },
      content: { media: { id: imageUrn } },
      lifecycleState: "PUBLISHED",
    },
    { headers: getHeaders(token) }
  );
}

/* ================= CAROUSEL (PDF) ================= */

async function createCarouselPdf(images) {
  const pdfPath = path.join(__dirname, `carousel-${Date.now()}.pdf`);
  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(pdfPath);

  doc.pipe(stream);

  for (const img of images) {
    const buffer = await getImageBuffer(img);
    doc.addPage({ size: [1080, 1080], margin: 0 });
    doc.image(buffer, 0, 0, { width: 1080, height: 1080 });
  }

  doc.end();

  return new Promise((resolve) =>
    stream.on("finish", () => resolve(pdfPath))
  );
}

async function initializeDocumentUpload(token, authorUrn) {
  const res = await axios.post(
    `${REST_BASE}/documents?action=initializeUpload`,
    { initializeUploadRequest: { owner: authorUrn } },
    { headers: getHeaders(token) }
  );

  const v = res.data?.value;
  if (!v?.uploadUrl || !v?.document) {
    throw new Error("Document init failed");
  }

  return { uploadUrl: v.uploadUrl, documentUrn: v.document };
}

async function uploadPdf(uploadUrl, pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  await axios.put(uploadUrl, buffer, {
    headers: { "Content-Type": "application/pdf" },
    maxBodyLength: Infinity,
  });
}

async function createDocumentPost(text, documentUrn, token, authorUrn) {
  return axios.post(
    `${REST_BASE}/posts`,
    {
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED" },
      content: {
        media: {
          id: documentUrn,
          title: "Swipe →",
        },
      },
      lifecycleState: "PUBLISHED",
    },
    { headers: getHeaders(token) }
  );
}

/* ================= VIDEO SUPPORT (NEW) ================= */

async function getVideoBuffer(video) {
  if (video.startsWith("http")) {
    const res = await axios.get(video, {
      responseType: "arraybuffer",
      maxBodyLength: Infinity,
    });
    return Buffer.from(res.data);
  }
  return fs.readFileSync(path.resolve(video));
}

async function initializeVideoUpload(token, authorUrn, fileSizeBytes) {
  const res = await axios.post(
    `${REST_BASE}/videos?action=initializeUpload`,
    {
      initializeUploadRequest: {
        owner: authorUrn,
        fileSizeBytes,
      },
    },
    { headers: getHeaders(token) }
  );
  console.log('res.data', res.data)
  const v = res.data?.value;

  if (!v?.video || !Array.isArray(v.uploadInstructions)) {
    throw new Error("Video init failed");
  }

  return {
    videoUrn: v.video,
    uploadToken: v.uploadToken,
    uploadInstructions: v.uploadInstructions,
  };
}

function extractSignedPartId(uploadUrl) {
  const match = uploadUrl.match(/uploadedVideo\/([^?]+)/);
  if (!match) {
    throw new Error("Signed chunk ID not found");
  }
  return match[1];
}



async function uploadVideoMultipart(uploadInstructions, buffer) {
const uploadedPartIds = [];

for (const part of uploadInstructions) {
  const chunk = buffer.slice(part.firstByte, part.lastByte + 1);

 let data =  await axios.put(part.uploadUrl, chunk, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": chunk.length,
    },
  });
  // console.log('data', data)

  uploadedPartIds.push(data.headers.etag);
}



 
  return uploadedPartIds;
}




async function createVideoPost(text, videoUrn, token, authorUrn) {
  console.log('videoUrn', videoUrn)

   return axios.post(
    `${REST_BASE}/posts`,
    {
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED" },
      content: {
        media: {
          id: videoUrn,
          title: "Play",
        },
      },
      lifecycleState: "PUBLISHED",
    },
    { headers: getHeaders(token) }
  );
}

async function waitForVideoReady(videoUrn, token, timeoutMs = 600000000000) {
  const start = Date.now();

  while (true) {
    const res = await axios.get(
      `${REST_BASE}/videos/${encodeURIComponent(videoUrn)}`,
      { headers: getHeaders(token) }
    );
console.log('res.data?.value', res.data)
    const status = res.data?.status;
    console.log("🎬 Video status:", status);

    if (status === "AVAILABLE") return;

    if (Date.now() - start > timeoutMs) {
      throw new Error("Video processing timed out");
    }

    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function finalizeVideoUpload(videoUrn, uploadToken, uploadedPartIds, token) {
  await axios.post(
    `${REST_BASE}/videos?action=finalizeUpload`,
    {
      finalizeUploadRequest: {
        video: videoUrn,
        uploadToken,
        uploadedPartIds,
      },
    },
    { headers: getHeaders(token) }
  );

  console.log("🎬 Video upload finalized");
}




async function postLinkedInVideo(text, video, token, authorUrn) {
  const buffer = await getVideoBuffer(video);

  const {
    videoUrn,
    uploadToken,
    uploadInstructions,
  } = await initializeVideoUpload(token, authorUrn, buffer.length);

  const uploadedPartIds = await uploadVideoMultipart(
    uploadInstructions,
    buffer
  );

  await finalizeVideoUpload(
    videoUrn,
    uploadToken,
    uploadedPartIds,
    token
  );

  await waitForVideoReady(videoUrn, token);

  return createVideoPost(text, videoUrn, token, authorUrn);
}




/* ================= MAIN ENTRY ================= */

async function postLinkedInCarousel(text, images, token, authorUrn) {
  if (!images || !images.length) {
    throw new Error("Images required");
  }

  if (images.length === 1) {
    const buffer = await getImageBuffer(images[0]);
    const imageUrn = await uploadImage(buffer, token, authorUrn);
    return createImagePost(text, imageUrn, token, authorUrn);
  }

  const pdfPath = await createCarouselPdf(images);
  const { uploadUrl, documentUrn } =
    await initializeDocumentUpload(token, authorUrn);

  await uploadPdf(uploadUrl, pdfPath);
  fs.unlinkSync(pdfPath);

  return createDocumentPost(text, documentUrn, token, authorUrn);
}

/* ================= ENGAGEMENT ================= */

async function likeLinkedInPost(shareUrn, token, authorUrn) {
  return axios.post(
    `${V2_BASE}/socialActions/${encodeURIComponent(shareUrn)}/likes`,
    { actor: authorUrn },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

async function commentOnLinkedInPost(shareUrn, message, token, authorUrn) {
  return axios.post(
    `${V2_BASE}/socialActions/${encodeURIComponent(shareUrn)}/comments`,
    {
      actor: authorUrn,
      message: { text: message },
      object: shareUrn,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

/* ================= EXPORT ================= */

module.exports = {
  postLinkedInCarousel,
  postLinkedInVideo,
  likeLinkedInPost,
  commentOnLinkedInPost,
  getLinkedInProfile,
  getAuthorizationUrl,
  exchangeCodeForToken,
};
