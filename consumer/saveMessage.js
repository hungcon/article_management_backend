var Article = require('../model/article');
var saveMessage = async function(message) {
    var messageObj = JSON.parse(message.value);
   
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
}

module.exports = saveMessage;