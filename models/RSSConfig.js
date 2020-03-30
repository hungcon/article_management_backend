const mongoose = require('mongoose');

const RSSConfigSchema = new mongoose.Schema({
  version: {
    type: 'Number',
  },
  url: {
    type: 'String',
  },
  configuration: {
    itemSelector: {
      type: 'String',
    },
    titleSelector: {
      type: 'String',
    },
    linkSelector: {
      type: 'String',
    },
    sapoSelector: {
      type: 'String',
    },
    publicDateSelector: {
      type: 'String',
    },
  },
});

const RSSConfig = mongoose.model('RSSConfig', RSSConfigSchema);

module.exports = RSSConfig;
