const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const axios = require("axios");

// Create an instance of the Express app
const app = express();

app.use(cors());

// Create a router to handle routes
const router = express.Router();

// Define a route that makes a call to the GitHub API and responds with the top 15 users by followers
router.get("/", async (req, res) => {
  try {
    const githubToken = process.env.TOKEN1; // Get the GitHub token from environment variables
    if (!githubToken) {
      throw new Error("GitHub token not found in environment variables.");
    }

    const response = await axios.get("https://api.github.com/users", {
      params: {
        per_page: 15,
        sort: "followers",
      },
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const topUsers = response.data;
    res.json(topUsers);
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);
