const saveArticles = require('./saveArticles');
const { articlesQueue } = require('../../../configs');

function consumerProgram(Consumer, client) {
  const arrticleConsumer = new Consumer(
    client,
    [
      {
        topic: articlesQueue.TOPIC_NAME,
        partition: articlesQueue.PARTITION,
      },
    ],
    {
      autoCommit: false,
    },
  );

  arrticleConsumer.on('message', (message) => saveArticles(message));
}

module.exports = consumerProgram;
