var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    pubDate: {
        type: Date,
    },
    link: {
        type: String
    },
    text: {
        type: String,
        trim: true
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;