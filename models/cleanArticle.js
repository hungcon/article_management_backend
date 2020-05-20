const mongoose = require('mongoose');

const { Schema } = mongoose;

const CleanArticleSchema = new mongoose.Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
  loanwords: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Loanwords',
    },
  ],
  abbreviations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Abbreviations',
    },
  ],
  allophones: {
    type: 'String',
  },
  cleanText: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CleanArticle = mongoose.model('CleanArticle', CleanArticleSchema);

module.exports = CleanArticle;
