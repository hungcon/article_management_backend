const mongoose = require('mongoose');

const { Schema } = mongoose;

const ParagraphSchema = new mongoose.Schema({
  paragraphId: Number,
  sentences: [
    {
      // type: Schema.Types.ObjectId,
      // ref: 'Sentence',
      type: Object,
    },
  ],
});

const Paragraph = mongoose.model('Paragraph', ParagraphSchema);

module.exports = Paragraph;
