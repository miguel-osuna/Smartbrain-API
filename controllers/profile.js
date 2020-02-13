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

const handleProfileUpdate = (req, res, knex) => {
  const { id } = req.params;
  const { name, age, occupation } = req.body.formInput;

  knex("users")
    .where({ id: id })
    .update({ name: name })
    .then(resp => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch(err => res.status(400).json("Error updating user"));
};

module.exports = {
  handleProfile: handleProfile,
  handleProfileUpdate: handleProfileUpdate
};
