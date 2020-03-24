/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { articlesQueue } = require('../configs');
const BackUp = require('../models/backup');

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

module.exports = { addArticle, updateArticle };
