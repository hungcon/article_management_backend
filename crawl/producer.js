var BackUp = require('../model/backup');
var kafka = require("kafka-node"),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient(),
  producer = new Producer(client);

var checkExist = async function(title) {
    var count = await BackUp.countDocuments({title: title})
    if(count > 0){
        return true;
    }
    return false;
}

var sendMessageToQueue = async (message) => {
    var exist = await checkExist(message.title);
    if(!exist){
        var payload = [{
            topic: "articles",
            messages: JSON.stringify(message),
            partition: 0
        }]
        producer.send(payload, (err, data) =>{
            //console.log(data)
        });
        BackUp.create(message, function(err){
            if(err){
                console.log(err)
            } else {
                console.log('Stored');
            }
        })
    }
    
}

module.exports = sendMessageToQueue;