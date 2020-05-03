const mongoose = require('mongoose');

const WordInfoSchema = new mongoose.Schema({
  position: Number,
  machineNormalize: String,
  peopleNormalize: String,
});

const WordInfo = mongoose.model('WordInfo', WordInfoSchema);

module.exports = WordInfo;
