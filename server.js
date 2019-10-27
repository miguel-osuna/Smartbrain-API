const express = require("express");
const app = express();

// Simulated Database
const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "john123",
      entries: 0,
      joined: new Date()
    },
    {
      id: "234",
      name: "Sally",
      email: "sally@gmail.com",
      password: "sally123",
      entries: 0,
      joined: new Date()
    }
  ]
};

app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  console.log(req.body);
  res.send(database.users);
});

// Sign In Route
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.status(200).json("Welcome " + database.users[0].name);
  } else {
    res.status(400).json("Error at login");
  }
});

// Register Route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: "345",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  console.log(database);

  res.json(database.users[database.users.length - 1]);
});

// Profile / User ID Route
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  user = database.users.filter(user => {
    return user.id === id;
  });

  if (user.length > 0) {
    res.json(user[0]);
  } else {
    res.status(404).json("User not found");
  }
});

// Image Route
app.put("/image", (req, res) => {
  const { id } = req.body;

  const user = database.users.filter(user => {
    return user.id === id;
  });

  if (user.length > 0) {
    user[0].entries++;
    res.json(user[0].entries);
  } else {
    res.status(404).json("User not found");
  }
});

// localhost:3000
app.listen(3000, () => {
  console.log("App is running on localhost:3000");
});
