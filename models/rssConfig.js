const mongoose = require('mongoose');

const RssConfigSchema = new mongoose.Schema({
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
    publishDateSelector: {
      type: 'String',
    },
  },
});

const RssConfig = mongoose.model('RssConfig', RssConfigSchema);

module.exports = RssConfig;
