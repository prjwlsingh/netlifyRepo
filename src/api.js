require('dotenv').config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const axios = require('axios');

// Create an instance of the Express app
const app = express();

app.use(cors());


// Create a router to handle routes
const router = express.Router();

// Define a route that responds with a JSON object when a GET request is made to the root path
router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

router.get("/github-users", async (req, res) => {
  try {
    const githubToken = process.env.GITHUB_API_TOKEN; // Get your GitHub API token from environment variables
    const numberOfUsers = 10; // Number of GitHub users you want to retrieve

    // Make a GET request to the GitHub API to search for users
    const response = await axios.get('https://api.github.com/search/users', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
      params: {
        q: 'type:user', // Search for user accounts
        per_page: numberOfUsers, // Number of users to retrieve
      },
    });

    // Extract the list of users from the GitHub API response
    const users = response.data.items;

    // Process and send the list of users as a JSON response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching GitHub users' });
  }
});



// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);