const mongoose = require('mongoose');

const BackUpSchema = new mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
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

BackUpSchema.index({ createAt: 1 }, { expireAfterSeconds: 60 * 40 });
const BackUp = mongoose.model('BackUp', BackUpSchema);

module.exports = BackUp;
