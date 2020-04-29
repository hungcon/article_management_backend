const mongoose = require('mongoose');

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
  category: [{ _id: false, id: Number, name: String }],
  website: { id: Number, name: String },
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
