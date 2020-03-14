var kafka = require("kafka-node"),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient(),
  producer = new Producer(client);

var sendMessageToQueue = (message) => {
    var payload = [{
        topic: "articles",
        messages: JSON.stringify(message),
        partition: 0
    }]
    producer.send(payload, (err, data) =>{
        //console.log(data)
    })
}

module.exports = sendMessageToQueue;