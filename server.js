const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log(req.params.name);
  res.status(200).send("All good baby");
});

app.post("/signin", (req, res) => {
  res.status(200).send("Sign In");
});

app.post("/register", (req, res) => {
  res.status(200).send("Sign Up");
});

app.listen(3000, () => {
  console.log("App is running on localhost:3000");
});
