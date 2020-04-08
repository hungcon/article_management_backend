const mongoose = require('mongoose');

const { Schema } = mongoose;

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
      type: Schema.Types.ObjectId,
      ref: 'RssConfig',
    },
  ],
  html: [
    {
      type: Schema.Types.ObjectId,
      ref: 'HtmlConfig',
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
