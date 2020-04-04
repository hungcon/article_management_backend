const mongoose = require('mongoose');

const ConfigurationSchema = new mongoose.Schema({
  category: {
    id: {
      type: 'Number',
    },
    name: {
      type: 'String',
    },
  },
  website: {
    id: {
      type: 'Number',
    },
    name: {
      type: 'String',
    },
  },
  createdAt: {
    type: 'Number',
  },
  rss: [
    {
      type: 'Object',
    },
  ],
  html: [
    {
      type: 'Object',
    },
  ],
  updatedAt: {
    type: 'Number',
  },
  article: {
    type: 'Object',
  },
  articleDemoLink: {
    type: 'String',
  },
  status: {
    type: 'String',
  },
  crawlType: {
    type: 'String',
  },
  schedules: [
    {
      type: String,
    },
  ],
  queue: {
    type: 'Number',
  },
});

const Configuration = mongoose.model('Configuration', ConfigurationSchema);

module.exports = Configuration;
