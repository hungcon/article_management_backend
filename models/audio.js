/* eslint-disable func-names */
const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  link: {
    type: String,
  },
  sentenceId: {
    type: String,
  },
  articleId: {
    type: String,
  },
});

const Audio = mongoose.model('Audio', AudioSchema);
module.exports = Audio;
