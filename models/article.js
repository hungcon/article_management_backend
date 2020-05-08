const mongoose = require('mongoose');

const { Schema } = mongoose;
const ArticleSchema = new mongoose.Schema({
  link: {
    type: 'String',
  },
  title: {
    type: 'String',
  },
  sapo: {
    type: 'String',
  },
  publicDate: Date,
  sourceCode: {
    type: 'String',
  },
  text: String,
  thumbnail: {
    type: 'String',
  },
  tags: [
    {
      type: 'String',
    },
  ],
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
  numberOfWords: Number,
  images: [
    {
      type: 'String',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isCleaned: {
    type: 'Number',
    enums: [
      0, // 'error',
      1, // 'cleaned',
    ],
    default: 0,
  },
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
