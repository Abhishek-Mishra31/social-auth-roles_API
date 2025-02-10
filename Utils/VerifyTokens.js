const axios = require("axios");

async function verifyToken(platform, token) {
  try {
    if (platform === "google") {
      response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        id: response.data.sub,
        email: response.data.email,
        name: response.data.name,
        profilePic: response.data.picture,
      };
    } else if (platform === "linkedin") {
      response = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      

      return {
        id: response.data.sub,
        email: response.data.email,
        name: response.data.name,
        profilePic: response.data.picture,
      };
    }
  } catch (error) {
    console.error("token verification failed:", error);
    return null;
  }
}

module.exports = { verifyToken };
