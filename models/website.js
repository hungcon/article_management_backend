const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  appId: String,
  bitRate: Number,
  titleTime: Number,
  sapoTime: Number,
  paragraphTime: Number,
});

const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
