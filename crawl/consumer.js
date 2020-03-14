var Article = require('../model/article');
var storeArticles = require('./storeArticles')
var kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient(),
  consumer = new Consumer(client, [{ topic: "articles", partition: 0 }], {
    autoCommit: false
  });

  var getMessage = () => {
    consumer.on('message', async function(message){
      var messageObj = JSON.parse(message.value);
      //storeArticles(messageObj);
        // if(messageObj.text == undefined){
        //   return false;
        // }
        var checkExist = await Article.findOne({title: messageObj.title});
        if(checkExist == null) {
            Article.create(messageObj, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log('Stored')
                }
            })
        }
    });
  }

  module.exports = getMessage;
  