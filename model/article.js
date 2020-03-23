const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true,
  },
  pubDate: {
    type: Date,
  },
  link: {
    type: String,
  },
  category: {
    type: Array,
  },
  text: {
    type: String,
    trim: true,
  },
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
