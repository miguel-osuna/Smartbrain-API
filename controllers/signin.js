const jwt = require("jsonwebtoken");

const handleSignIn = (req, res, knex, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("Bad form submission");
  }
  return knex
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
          .then(user => user[0])
          .catch(err => Promise.reject("Unable to get user"));
      } else {
        Promise.reject("Sorry, wrong credential");
      }
    })
    .catch(err => Promise.reject("Sorry, wrong email or password"));
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
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id, redisClient)
    .then(() => {
      return { success: "true", userId: id, token: token };
    })
    .catch(console.log);
};

const signinAuthentication = (req, res, knex, bcrypt, redisClient) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res, redisClient)
    : handleSignIn(req, res, knex, bcrypt)
        .then(data => {
          return data.id && data.email
            ? createSession(data, redisClient)
            : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = signinAuthentication;
