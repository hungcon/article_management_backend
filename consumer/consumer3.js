const kafka = require('kafka-node');

const { Consumer } = kafka;
const client = new kafka.KafkaClient();
const consumer = new Consumer(client, [{ topic: 'articles', partition: 0 }], {
  autoCommit: false,
});

const saveMessage = require('./saveMessage');

const consumer3 = () => {
  consumer.on('message', (message) => saveMessage(message));
};

module.exports = consumer3;
