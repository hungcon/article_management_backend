const mongoose = require('mongoose');

const { Schema } = mongoose;

const CleanArticleSchema = new mongoose.Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
  sentences: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sentence',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CleanArticle = mongoose.model('CleanArticle', CleanArticleSchema);

module.exports = CleanArticle;
