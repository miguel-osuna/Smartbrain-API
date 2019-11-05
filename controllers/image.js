// Clarifai module
const Clarifai = require("clarifai");

// Initialize with API Key
const app = new Clarifai.App({ apiKey: "f73fa5b8f7e946c3820224301837db65" });

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("Unable to work with API"));
};

const handleImage = (req, res, knex) => {
  const { id } = req.body;

  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to return entries"));
};

module.exports = { handleImage: handleImage, handleApiCall: handleApiCall };