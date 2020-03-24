/* eslint-disable no-console */
/* eslint-disable func-names */
function producerProgram(Producer, client) {
  const producer = new Producer(client);
  producer.on('ready', function () {
    console.log('Producer are ready');
  });

  producer.on('error', function (err) {
    console.log(`[Producer is on error]: ${err}`);
  });

  global.PRODUCER = producer;
}

module.exports = producerProgram;
