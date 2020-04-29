const mongoose = require('mongoose');

const { Schema } = mongoose;

const CleanArticleSchema = new mongoose.Schema({
  articleId: {
    type: Schema.Types.ObjectId,
  },
  loanwords: [
    {
      type: 'String',
    },
  ],
  abbreviations: [
    {
      type: 'String',
    },
  ],
  xml: {
    type: 'String',
  },
  cleanText: {
    type: 'String',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CleanArticle = mongoose.model('CleanArticle', CleanArticleSchema);

module.exports = CleanArticle;
