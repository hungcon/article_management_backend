const mongoose = require('mongoose');

// const { Schema } = mongoose;

const SentenceSchema = new mongoose.Schema({
  sentenceId: Number,
  allophones: String,
  text: String,
  // loanwords: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Loanwords',
  //   },
  // ],
  // abbreviations: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Abbreviations',
  //   },
  // ],
});

const Sentence = mongoose.model('Sentence', SentenceSchema);

module.exports = Sentence;
