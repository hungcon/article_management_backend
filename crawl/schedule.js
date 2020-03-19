var getArticles = require('./getArticles');
var getText = require('./getText');
var sendMessageToQueue = require('./producer');
var schedule = async (listRSS) => {
    var listArticles = await getArticles(listRSS);
    var documents = [];
    await Promise.all(listArticles.map(async (article) => {
        var text = await getText(article.link);
        var document = {};
        document.title = article.title;
        document.pubDate = article.pubDate;
        document.link = article.link;
        document.text = text;
        sendMessageToQueue(document);
        //console.log(document)
        // documents.push(document);
    }));
    // abc(documents);
}


module.exports = schedule;