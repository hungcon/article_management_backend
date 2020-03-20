var getArticles = require('./getArticles');
var getText = require('./getText');
var sendMessageToQueue = require('./producer');
var schedule = async (source) => {
    var listArticles = await getArticles(source);
    for(let i = 0; i < listArticles.length; i++){
        var text = await getText(listArticles[i].link);
        var document = {};
        document.title = listArticles[i].title;
        document.pubDate = listArticles[i].pubDate;
        document.link = listArticles[i].link;
        document.category = listArticles[i].category;
        document.text = text;
        sendMessageToQueue(document);
    }
}


module.exports = schedule;