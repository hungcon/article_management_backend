const mongoose = require('mongoose');

const ArticleConfigSchema = new mongoose.Schema({
  sapoSelector: {
    type: String,
  },
  sapoRedundancySelectors: {
    type: Array,
  },
  titleSelector: {
    type: String,
  },
  titleRedundancySelectors: {
    type: Array,
  },
  thumbnailSelector: {
    type: String,
  },
  thumbnailRedundancySelectors: {
    type: Array,
  },
  tagsSelector: {
    type: String,
  },
  tagsRedundancySelectors: {
    type: Array,
  },
  contentSelector: {
    type: String,
  },
  contentRedundancySelectors: {
    type: Array,
  },
  textRedundancySelectors: [{ type: String }],
});

const ArticleConfig = mongoose.model('ArticleConfig', ArticleConfigSchema);

module.exports = ArticleConfig;
