const mongoose = require('mongoose');

const BlockConfigSchema = new mongoose.Schema({
  configuration: {
    redundancySelectors: {
      type: [
        {
          type: 'String',
        },
      ],
    },
    itemSelector: {
      type: 'String',
    },
    titleSelector: {
      type: 'String',
    },
    linkSelector: {
      type: 'String',
    },
  },
  blockSelector: {
    type: 'String',
  },
});

const BlockConfig = mongoose.model('BlockConfig', BlockConfigSchema);

module.exports = BlockConfig;
