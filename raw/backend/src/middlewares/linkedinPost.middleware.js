
const axios = require("axios");

const REST_BASE = "https://api.linkedin.com/rest";
// const TOKEN = 'AQVd0jK9VEyJKYIY9WqDcP0bwQo0AMLpEJ_e6SynZK4niWYFxPcJY8YXeWYMbxibsgzAPWoGJnkmimLvIzaKdv4bu4WGDFCNXsZivO9H4GVBAaoNvvm0hb8iOFfmJ0Tb6PM7PteGSsWziiSA0eA9X1QGCiSA74O1fG7ZlgHaCOhWtX7wFcxouHMYt6KJ3OYR-rshS_2wQAcZyoWtgafXUPx7L94dtwzA477NowPIv4nRF-M-FsNXFerXRi3U_2qsL6r8sz14OLKwIE_mwBk1yE3THxU1pETH_Jpxk_aQcvvcRax4fsZbW7WwilMODeCnkeYPwKTi2QSvDatDfN6JSRbtiso9xw';


const HEADERS = (Token) => ({
  Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN || Token}`,
  "LinkedIn-Version": "202502",
  "Content-Type": "application/json"
});

const encodeUrn = urn => encodeURIComponent(urn);

/**
 * Fetch likes + comments count
 */
async function fetchPostStats(postUrn, Token) {
  try {
   // console.log('Fetching stats for:', postUrn)
  const res = await axios.get(
    `${REST_BASE}/socialActions/${encodeUrn(postUrn)}`,
    { headers: HEADERS(Token) }
  );
  return {
    likes: res.data?.likesSummary?.count || 0,
    comments: res.data?.commentsSummary?.count || 0
  };
  } catch (error) {
    console.error('Error fetching post stats for:', postUrn, error.response?.data || error.message);
    return {
      likes: 0,
      comments: 0
    };
  }
}

/**
 * Fetch all comments (paginated)
 */
async function fetchAllComments(postUrn, Token) {
  let start = 0;
  const count = 50;
  let comments = [];

  while (true) {
    const res = await axios.get(
      `${REST_BASE}/socialActions/${encodeUrn(postUrn)}/comments`,
      {
        headers: HEADERS(Token),
        params: { start, count }
      }
    );

    const batch = res.data?.elements || [];

    comments.push(
      ...batch.map(c => ({
        commentUrn: c.id,
        authorUrn: c.actor,
        message: c.message?.text || "",
        createdAt: c.createdAt
      }))
    );

    if (batch.length < count) break;
    start += count;
  }

  return comments;
}

/**
 * Aggregate everything
 */
async function getPostFullDetails(postUrn, Token) {
  //console.log('Fetching full details for:', postUrn);
  const [stats, comments] = await Promise.all([
    fetchPostStats(postUrn, Token),
    fetchAllComments(postUrn, Token)
  ]);
console.log('Full details fetched for:', postUrn, { stats, comments });
  return {
    postUrn,
    stats,
    comments
  };
}

module.exports = { getPostFullDetails };
