var BackUp = require('../model/backup');
var kafka = require("kafka-node"),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient(),
  producer = new Producer(client);

const checkExist = async function(title, category) {
    // return 0 nếu chưa tồn tại trong backup
    // return 1 nếu đã tồn tại trong backup và category chưa đc thêm
    // return 2 nếu đã tồn tại trong backup và category đã đc thêm
    let article = await BackUp.findOne({title: title});
    if(article == null){
        return 0;
    } else {
        let listCategory = article.category;
        let checkCategory = listCategory.includes(category);
        if(!checkCategory){
            return 1;
        }
        return 2;
    }
}

const sendMessageToQueue = async (message) => {
    let exist = await checkExist(message.title, message.category);
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
}
const addData = (message) => {
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
            console.log('Storaged');
        }
    })
}

const updateCategory = (message) => {
    var payload = [{
        topic: "articles",
        messages: JSON.stringify(message),
        partition: 0
    }]
    producer.send(payload, (err, data) =>{
        //console.log(data)
    });
    BackUp.findOneAndUpdate(
        {title: message.title}, 
        {$push: {category: message.category}}, 
        function(err){
            if(err){
                console.log(err)
            } else {
                console.log('Updated');
            }
    })
}

module.exports = sendMessageToQueue;