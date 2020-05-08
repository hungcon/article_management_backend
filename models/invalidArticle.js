const mongoose = require('mongoose');

const { Schema } = mongoose;

const InvalidArticleSchema = new mongoose.Schema({
  link: {
    type: 'String',
  },
  title: {
    type: 'String',
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  website: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
  },
  reason: {
    type: 'String',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InvalidArticle = mongoose.model('InvalidArticle', InvalidArticleSchema);

module.exports = InvalidArticle;
