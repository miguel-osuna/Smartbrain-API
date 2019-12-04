const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();

// Load environmental variables
require("dotenv").config();

// Imported routes
const handleSingIn = require("./controllers/signin.js");
const image = require("./controllers/image.js");
const handleRegister = require("./controllers/register.js");
const handleProfile = require("./controllers/profile.js");

// Heroku Database
const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL, // localhost:5432
    ssl: true
  }
});

// Users: id, name, email, entries, joined
// Login: id, hash, email

app.use(express.json());
app.use(cors());

// Root Route
app.get("/", (req, res) => res.json("It's working"));

// Sign In Route
app.post("/signin", (req, res) => handleSingIn(req, res, knex, bcrypt));

// Register Route
app.post("/register", (req, res) => handleRegister(req, res, knex, bcrypt));

// Profile / User ID Route
app.get("/profile/:id", (req, res) => handleProfile(req, res, knex));

// Image Route
app.put("/image", (req, res) => image.handleImage(req, res, knex));

// Image Api
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

// localhost:3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
