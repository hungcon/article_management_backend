/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const kafka = require('kafka-node');
const BackUp = require('../model/backup');

const { Producer } = kafka;
const client = new kafka.KafkaClient();
const producer = new Producer(client);

const checkExist = async (title, category) => {
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

const sendMessageToQueue = async (message) => {
  const exist = await checkExist(message.title, message.category);
  switch (exist) {
    case 0:
      addData(message);
      break;
    case 1:
      updateCategory(message);
      break;
    case 2:
      break;
    default:
      break;
  }
};
const addData = (message) => {
  const payload = [
    {
      topic: 'articles',
      messages: JSON.stringify(message),
      partition: 0,
    },
  ];
  producer.send(payload, (err, data) => {
    // console.log(data)
  });
  BackUp.create(message, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Storaged');
    }
  });
};

const updateCategory = (message) => {
  const payload = [
    {
      topic: 'articles',
      messages: JSON.stringify(message),
      partition: 0,
    },
  ];
  producer.send(payload, (_err, _data) => {
    // console.log(data)
  });
  BackUp.findOneAndUpdate(
    { title: message.title },
    { $push: { category: message.category } },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Updated');
      }
    },
  );
};

module.exports = sendMessageToQueue;
