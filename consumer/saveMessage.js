var Article = require('../model/article');
var BackUp = require('../model/backup')

const checkExist = async function(title, category) {
    // return 0 - Nếu backup rỗng ==> ko làm gì
    // return 1 - Backup có bản ghi và article rỗng => thêm mới bản ghi vào article
    // return 2 - Backup có bản ghi và article có bản ghi, category chưa đc thêm => update push category vào article
    // return 3 - Backup có bản ghi và article có bản ghi, category đã đc thêm => ko làm gì cả
    let backup = await BackUp.findOne({title: title});
    let article = await Article.findOne({title: title});
    if(backup == null){
        return 0;
    } else {
        if(article == null){
            return 1;
        } else {
            let articleCategory = article.category;
            let checkCategory = articleCategory.includes(category);
            if(!checkCategory){
                return 2;
            }
            return 3;
        }
    }
}

var saveMessage = async function(message) {
    var messageObj = JSON.parse(message.value);
    var exist = await checkExist(messageObj.title, messageObj.category);
    switch (exist) {
        case 0:
           //do nothing
            break;
        case 1:
            storage(messageObj);
            break;
        case 2:
            update(messageObj);
            break;
        case 3: 
            //do nothing
            break;
        default:
            break;
    }
}

const storage = (message) => {
    Article.create(message, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log('A - Storaged')
        }
    })
}

const update = (message) => {
    Article.findOneAndUpdate(
        {title: message.title}, 
        {$push: {category: message.category}}, 
        function(err){
            if(err){
                console.log(err)
            } else {
                console.log('A- Updated');
            }
    })
}

module.exports = saveMessage;