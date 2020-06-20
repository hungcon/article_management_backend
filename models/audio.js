/* eslint-disable func-names */
const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  link: {
    type: String,
  },
  articleId: String,
  paragraphId: String,
  paragraphIndex: String,
  sentenceId: String,
});

const Audio = mongoose.model('Audio', AudioSchema);
module.exports = Audio;
