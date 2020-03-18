var Article = require('../model/article');
var checkExist = async function(title) {
    var count = await Article.countDocuments({title: title})
    if(count > 0){
        return true;
    }
    return false;
}
var saveMessage = async function(message) {
    var messageObj = JSON.parse(message.value);
    var exist = await checkExist(messageObj.title);
    if(!exist) {
        Article.create(messageObj, function(err){
            if(err) {
                console.log(err);
            } else {
                console.log('A - Stored')
            }
        })
    }
}

module.exports = saveMessage;