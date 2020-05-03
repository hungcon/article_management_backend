const mongoose = require('mongoose');

const { Schema } = mongoose;

const AbbreviationsSchema = new mongoose.Schema({
  words: String,
  normalize: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WordInfo',
    },
  ],
});

const Abbreviations = mongoose.model('Abbreviations', AbbreviationsSchema);

module.exports = Abbreviations;
