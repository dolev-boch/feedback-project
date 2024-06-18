const express = require("express");
const path = require("path");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const { authenticateUser } = require("./authService"); // Adjust path as per your project structure
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URI from environment variable
const uri = process.env.MONGODB_URI;

// Set up MongoDB client without deprecated options
const client = new MongoClient(uri);

// Connect to MongoDB using async-await syntax
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Set up session middleware with secret after MongoDB connection is established
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "secret", // Replace with your actual session secret
        resave: false,
        saveUninitialized: true,
      })
    );

    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.urlencoded({ extended: true }));

    // Route to serve index.html and handle login
    app.get("/", (req, res) => {
      if (req.session.username) {
        res.send(
          `<h1>Hello ${req.session.username} - You are already logged in. <a href="/logout">Logout</a></h1>`
        );
      } else {
        res.sendFile(path.join(__dirname, "public", "index.html"));
      }
    });

    // Route to handle login form submission
    app.post("/login", async (req, res) => {
      const { username, password } = req.body;

      try {
        const result = await authenticateUser(username, password);

        if (result.success) {
          req.session.username = username; // Store username in session
          res.send("Login successful!"); // Send success message to client
        } else {
          res.status(401).send("Login failed: " + result.message); // Send failure message to client
        }
      } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Server error"); // Server error handling
      }
    });

    // Route to handle logout
    app.post("/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          res.status(500).send("Server error");
        } else {
          res.redirect("/"); // Redirect to main page after logout
        }
      });
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit with failure
  }
}

// Call the async function to start the server and connect to MongoDB
connectToMongoDB();
