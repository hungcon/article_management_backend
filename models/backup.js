const mongoose = require('mongoose');

const BackUpSchema = new mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
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
  category: [{ id: Number, name: String }],
  website: { id: Number, name: String },
  numberOfWords: Number,
  images: [
    {
      type: 'String',
    },
  ],
});

BackUpSchema.index({ createAt: 1 }, { expireAfterSeconds: 60 * 40 });
const BackUp = mongoose.model('BackUp', BackUpSchema);

module.exports = BackUp;
