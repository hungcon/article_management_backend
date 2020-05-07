const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  name: String,
});

const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
