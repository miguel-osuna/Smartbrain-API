const jwt = require("jsonwebtoken");

const handleRegister = (req, res, knex, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("Bad form submission");
  }
  const hash = bcrypt.hashSync(password);

  return knex
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
            .then(user => user[0])
            .catch(err => Promise.reject("Unable to get user"));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => Promise.reject("This email is already registered"));
};

const getAuthTokenId = (req, res, redisClient) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Unauthorized");
    } else {
      return res.json({ id: reply });
    }
  });
};

const signToken = email => {
  const jwtPayload = { email: email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2 days" });
};

const setToken = (key, value, redisClient) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user, redisClient) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id, redisClient)
    .then(() => {
      return { success: "true", userId: id, token: token };
    })
    .catch(console.log);
};

const registerAuthentication = (req, res, knex, bcrypt, redisClient) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res, redisClient)
    : handleRegister(req, res, knex, bcrypt)
        .then(data => {
          return data.id && data.email
            ? createSession(data, redisClient)
            : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = registerAuthentication;
