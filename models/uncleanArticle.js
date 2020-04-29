const mongoose = require('mongoose');

const { Schema } = mongoose;

const UnCleanArticleSchema = new mongoose.Schema({
  articleId: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UnCleanArticle = mongoose.model('UnCleanArticle', UnCleanArticleSchema);

module.exports = UnCleanArticle;
