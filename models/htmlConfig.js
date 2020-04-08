const mongoose = require('mongoose');

const { Schema } = mongoose;

const HtmlConfigSchema = new mongoose.Schema({
  url: {
    type: 'String',
  },
  contentRedundancySelectors: {
    type: 'Array',
  },
  blocksConfiguration: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BlockConfig',
    },
  ],
});

const HtmlConfig = mongoose.model('HtmlConfig', HtmlConfigSchema);

module.exports = HtmlConfig;
