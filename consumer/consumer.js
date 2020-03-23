const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/crawler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const kafka = require('kafka-node');

const { Consumer } = kafka;
const client = new kafka.KafkaClient();
const consumer = new Consumer(client, [{ topic: 'articles', partition: 0 }], {
  autoCommit: false,
});

const saveMessage = require('./saveMessage');

consumer.on('message', (message) => saveMessage(message));
