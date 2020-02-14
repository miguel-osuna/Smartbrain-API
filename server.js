const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const redis = require("redis");

// Load environmental variables
require("dotenv").config();

// Imported routes
const signinAuthentication = require("./controllers/signin.js");
const image = require("./controllers/image.js");
const registerAuthentication = require("./controllers/register.js");
const profile = require("./controllers/profile.js");
const auth = require("./controllers/authorization.js");

// Users: id, name, email, entries, joined
// Login: id, hash, email\
// // Heroku Database
// const knex = require("knex")({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL, // localhost:5432
//     ssl: true
//   }
// });

// Local Database
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  }
});

// Sets up redis client
const redisClient = redis.createClient(process.env.REDIS_URI);

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

// Root Route
app.get("/", (req, res) => res.json("It's working"));

// Sign In Route
app.post("/signin", (req, res) =>
  signinAuthentication(req, res, knex, bcrypt, redisClient)
);

// Register Route
app.post("/register", (req, res) =>
  registerAuthentication(req, res, knex, bcrypt, redisClient)
);

// Profile / User ID Route
app.get("/profile/:id", auth.requireAuth, (req, res) =>
  profile.handleProfile(req, res, knex)
);

// Update Profile Route
app.post("/profile/:id", auth.requireAuth, (req, res) =>
  profile.handleProfileUpdate(req, res, knex)
);

// Image Route
app.put("/image", auth.requireAuth, (req, res) =>
  image.handleImage(req, res, knex)
);

// Image Api
app.post("/imageurl", auth.requireAuth, (req, res) =>
  image.handleApiCall(req, res)
);

// localhost:3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});

module.exports = {
  redisClient: redisClient
};
