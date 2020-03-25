/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { articlesQueue } = require('../../configs');
const BackUp = require('../../models/backup');

const addArticle = async (PRODUCER, message) => {
  const payload = [
    {
      topic: articlesQueue.TOPIC_NAME,
      messages: JSON.stringify(message),
      partition: articlesQueue.PARTITION,
    },
  ];
  PRODUCER.send(payload, (err, data) => {
    console.log('Save to queue');
  });
  const result = await BackUp.create(message);
  if (!result) {
    console.log('Error');
  } else {
    console.log('Added');
  }
};

const updateArticle = async (PRODUCER, message) => {
  const payload = [
    {
      topic: articlesQueue.TOPIC_NAME,
      messages: JSON.stringify(message),
      partition: articlesQueue.PARTITION,
    },
  ];
  PRODUCER.send(payload, (_err, _data) => {
    console.log('Save to queue');
  });
  const result = await BackUp.findOneAndUpdate(
    { title: message.title },
    { $push: { category: message.category } },
  ).exec();
  if (!result) {
    console.log('Error');
  } else {
    console.log('Updated');
  }
};

const checkExistInBackUp = async (title, category) => {
  // return 0 nếu chưa tồn tại trong backup
  // return 1 nếu đã tồn tại trong backup và category chưa đc thêm
  // return 2 nếu đã tồn tại trong backup và category đã đc thêm
  const article = await BackUp.findOne({ title });
  if (article == null) {
    return 0;
  }
  const listCategory = article.category;
  const checkCategory = listCategory.includes(category);
  if (!checkCategory) {
    return 1;
  }
  return 2;
};

module.exports = { addArticle, updateArticle, checkExistInBackUp };
