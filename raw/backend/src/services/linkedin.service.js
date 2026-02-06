const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const sharp = require("sharp");

/* ================= CONFIG ================= */

const REST_BASE = "https://api.linkedin.com/rest";
const V2_BASE = "https://api.linkedin.com/v2";

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "LinkedIn-Version": "202502",
  "Content-Type": "application/json"
});

const getLinkedInConfig = () => ({
  CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '867r7zntr4hqtf',
  CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || 'WPL_AP1.LgX8x1dHyeFS1MBq.DsdPTQ==',
  // Standard clean path for OAuth redirects.
  // CRITICAL: This must match EXACTLY what is registered in your LinkedIn App settings.
  REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI || 'https://aipost.bastionex.net/settings',
  SCOPES: 'openid r_verify profile r_profile_basicinfo email w_member_social'
});

/* ================= OAUTH ================= */

function getAuthorizationUrl() {
  const c = getLinkedInConfig();
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${c.CLIENT_ID}&redirect_uri=${encodeURIComponent(
    c.REDIRECT_URI
  )}&scope=${encodeURIComponent(c.SCOPES)}`;
}

async function exchangeCodeForToken(code) {
  const c = await getLinkedInConfig();
  const res = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      params: {
        grant_type: "authorization_code",
        code,
        client_id: c.CLIENT_ID,
        client_secret: c.CLIENT_SECRET,
        redirect_uri: c.REDIRECT_URI
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );
  return res.data.access_token;
}

async function getLinkedInProfile(token) {
  const res = await axios.get(`${V2_BASE}/userinfo`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return {
    urn: `urn:li:person:${res.data.sub}`,
    firstName: res.data.given_name || res.data.name,
    lastName: res.data.family_name || "",
    profilePicture:
      res.data.picture ||
      `https://api.dicebear.com/7.x/avataaars/png?seed=${res.data.sub}`
  };
}

/* ================= IMAGE HELPERS ================= */

async function getImageBuffer(img) {
  let input;
  try {
  console.log("Processing image:", img.slice(0, 30) + (img.length > 30 ? "..." : ""));
  if (img.startsWith("data:image")) {
    input = Buffer.from(img.split(",")[1], "base64");
  } else if (img.startsWith("http")) {
    //console.log("Fetching image from URL:", img);
   const res = await axios.get(img, {
  responseType: "arraybuffer",
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "image/*",
    "Referer": "https://chat.openai.com"
  },
  timeout: 10000
});

    console.log('res', res)
    input = Buffer.from(res.data);
  } else {
    input = fs.readFileSync(path.resolve(img));
  }

    console.log("Converting image to LinkedIn format...");
    const buffer = await sharp(input)
      .rotate()
      .resize(1080, 1080, { fit: "cover" })
      .toColorspace("srgb")
      .png({ compressionLevel: 9 })
      .toBuffer();

    const meta = await sharp(buffer).metadata();
    console.log("Image OK:", meta.width, "x", meta.height);

    return buffer;
  } catch (err) {
    console.error("Image conversion failed:", err);
    throw new Error("Invalid image format for LinkedIn");
  }
}

/* ================= IMAGE POST ================= */

async function uploadImage(imageBuffer, token, authorUrn) {
  const init = await axios.post(
    `${REST_BASE}/images?action=initializeUpload`,
    { initializeUploadRequest: { owner: authorUrn } },
    { headers: getHeaders(token) }
  );

  const value = init.data?.value;
  if (!value?.uploadUrl || !value?.image) {
    throw new Error("LinkedIn image init failed");
  }

  await axios.put(value.uploadUrl, imageBuffer, {
    headers: { "Content-Type": "image/png" },
    maxBodyLength: Infinity
  });

  return value.image;
}

async function createImagePost(text, imageUrn, token, authorUrn) {
  return axios.post(
    `${REST_BASE}/posts`,
    {
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED" },
      content: {
        media: {
          id: imageUrn,
          
        }
      },
      lifecycleState: "PUBLISHED"
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

  return {
    uploadUrl: v.uploadUrl,
    documentUrn: v.document
  };
}

async function uploadPdf(uploadUrl, pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  await axios.put(uploadUrl, buffer, {
    headers: { "Content-Type": "application/pdf" },
    maxBodyLength: Infinity
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
          title: "Swipe →"
        }
      },
      lifecycleState: "PUBLISHED"
    },
    { headers: getHeaders(token) }
  );
}

/* ================= MAIN ENTRY ================= */

async function postLinkedInCarousel(text, images, token, authorUrn) {
  if (!images || !images.length) {
    throw new Error("Images required");
  }

  if (images.length === 1) {
    console.log("Single image detected, posting as image post.");
    const buffer = await getImageBuffer(images[0]);
    console.log("Uploading single image..."); 
    const imageUrn = await uploadImage(buffer, token, authorUrn);
    console.log("Single image uploaded successfully.");
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
      object: shareUrn
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

/* ================= EXPORT ================= */

module.exports = {
  postLinkedInCarousel,
  likeLinkedInPost,
  commentOnLinkedInPost,
  getLinkedInProfile,
  getAuthorizationUrl,
  exchangeCodeForToken
};
