const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
});

const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
