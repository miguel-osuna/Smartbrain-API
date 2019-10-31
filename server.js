const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1", // localhost:5432
    user: "miguelosuna",
    password: "abcde12345",
    database: "smart-brain"
  }
});

// Users: id, name, email, entries, joined
// Login: id, hash, email

app.use(express.json());
app.use(cors());

// Root Route
app.get("/", (req, res) => {
  console.log(req.body);
  res.json(database.users);
});

// Sign In Route
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  knex
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const is_valid = bcrypt.compareSync(password, data[0].hash);
      if (is_valid) {
        return knex
          .select("*")
          .from("users")
          .where("email", email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Sorry, wrong credential");
      }
    })
    .catch(err => res.status(400).json("Sorry, wrong email or password"));
});

// Register Route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  knex
    .transaction(trx => {
      trx
        .insert({
          hash: hash,
          email: email
        })
        .into("login")
        .returning("email")
        .then(login_email => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: login_email[0],
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json("This email is already registered"));
});

// Profile / User ID Route
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  knex
    .select("*")
    .from("users")
    .where({ id: id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("User not found");
      }
    });
});

// Image Route
app.put("/image", (req, res) => {
  const { id } = req.body;

  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to return entries"));
});

// localhost:3000
app.listen(5000, () => {
  console.log("App is running on localhost:5000");
});
