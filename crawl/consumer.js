var kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient(),
  consumer = new Consumer(client, [{ topic: "articles", partition: 0 }], {
    autoCommit: false
  });

  var getMessage = () => {
    console.log('a')
    consumer.on('message', function(message){
        console.log(message)
    })
  }

  module.exports = getMessage;
  