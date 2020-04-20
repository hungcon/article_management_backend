const mongoose = require('mongoose');

const InvalidArticleSchema = new mongoose.Schema({
  link: {
    type: 'String',
  },
  title: {
    type: 'String',
  },
  category: [{ _id: false, id: Number, name: String }],
  website: { id: Number, name: String },
});

const InvalidArticle = mongoose.model('InvalidArticle', InvalidArticleSchema);

module.exports = InvalidArticle;
