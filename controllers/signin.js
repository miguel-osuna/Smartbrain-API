const handleSignIn = (req, res, knex, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Bad form submission");
  }
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
};

module.exports = handleSignIn;
