const handleRegister = (req, res, knex, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("Bad form submission");
  }
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
};

module.exports = handleRegister;
