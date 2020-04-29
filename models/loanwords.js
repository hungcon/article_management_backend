const mongoose = require('mongoose');

const LoanwordsSchema = new mongoose.Schema({
  words: String,
  positions: [
    {
      type: Number,
    },
  ],
  machineClean: String,
  peopleClean: String,
});

const Loanwords = mongoose.model('Loanwords', LoanwordsSchema);

module.exports = Loanwords;
