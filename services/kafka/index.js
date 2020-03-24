/* eslint-disable no-undef */
const kafka = require('kafka-node');
const consumerProgram = require('./consumer');
const producerProgram = require('./producer');
const { addArticle, updateArticle } = require('../../utils/backup');
const { checkExistInBackUp } = require('../../utils/checkExist');

const { Consumer } = kafka;
const { Producer } = kafka;
const client = new kafka.KafkaClient();

consumerProgram(Consumer, client);
producerProgram(Producer, client);

async function saveArticlesToQueue(message) {
  const exist = await checkExistInBackUp(message.title, message.category);
  switch (exist) {
    case 0:
      addArticle(PRODUCER, message);
      break;
    case 1:
      updateArticle(PRODUCER, message);
      break;
    case 2:
      break;
    default:
      break;
  }
}

module.exports = { saveArticlesToQueue };
