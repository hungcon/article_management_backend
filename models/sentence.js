const mongoose = require('mongoose');

const SentenceSchema = new mongoose.Schema({
  sentenceId: Number,
  allophones: String,
});

const Sentence = mongoose.model('Sentence', SentenceSchema);

module.exports = Sentence;
