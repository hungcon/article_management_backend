const mongoose = require('mongoose');

const { Schema } = mongoose;
const ArticleSchema = new mongoose.Schema({
  link: {
    type: 'String',
  },
  title: {
    type: 'String',
  },
  sapo: {
    type: 'String',
  },
  publicDate: Date,
  sourceCode: {
    type: 'String',
  },
  text: String,
  thumbnail: {
    type: 'String',
  },
  tags: [
    {
      type: 'String',
    },
  ],
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  website: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
  },
  numberOfWords: Number,
  images: [
    {
      type: 'String',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: 'Number',
    enums: [
      1, // Đã thu thập,
      2, // Chuẩn hoá máy lỗi
      3, // Đã chuẩn hoá máy
      4, // Đang chuẩn hoá tay
      5, // Đã chuẩn hoá tay
      6, // Đang chuyển audio
      7, // Chuyển audio lỗi
      8, // Đã chuyển audio
    ],
    default: 1,
  },
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
