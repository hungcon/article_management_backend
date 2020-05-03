const mongoose = require('mongoose');

const { Schema } = mongoose;

const LoanwordsSchema = new mongoose.Schema({
  words: String,
  normalize: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WordInfo',
    },
  ],
});

const Loanwords = mongoose.model('Loanwords', LoanwordsSchema);

module.exports = Loanwords;
