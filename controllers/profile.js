const handleProfile = (req, res, knex) => {
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
};

module.exports = handleProfile;
