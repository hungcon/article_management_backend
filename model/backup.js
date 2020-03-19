var mongoose = require('mongoose');
var ttl = require('mongoose-ttl');

var BackUpSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true
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

BackUpSchema.index({createAt: 1}, {expireAfterSeconds: 60 })
var BackUp = mongoose.model('BackUp', BackUpSchema);

module.exports = BackUp;