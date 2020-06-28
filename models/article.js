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
  text: String,
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
  paragraphs: [
    {
      // type: Schema.Types.ObjectId,
      // ref: 'Paragraph',
      type: Object,
    },
  ],
  linkAudio: {
    type: String,
    default: '',
  },
  status: {
    type: 'Number',
    enums: [
      1, // Đã thu thập,
      2, // Chuẩn hoá máy lỗi
      3, // Đã chuẩn hoá máy
      4, // Đang chuẩn hoá tay
      5, // Đang chờ phê duyệt
      6, // Đang chuyển audio
      7, // Chuyển audio lỗi
      8, // Đã chuyển audio
    ],
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
