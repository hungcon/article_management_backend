const mongoose = require('mongoose');

const AbbreviationsSchema = new mongoose.Schema({
  words: String,
  positions: [
    {
      type: Number,
    },
  ],
  machineClean: String,
  peopleClean: String,
});

const Abbreviations = mongoose.model('Abbreviations', AbbreviationsSchema);

module.exports = Abbreviations;
