let Parser = require('rss-parser');
let parser = new Parser();
var getText = require('./getText');
var sendMessageToQueue = require('./producer');

const crawl = async (rss) => {
    let feed = await parser.parseURL(rss);
    var documents = [];
    await Promise.all(feed.items.map(async (item) => {
        var text = await getText(item.link);
        var document = {};
        document.title = item.title;
        document.pubDate = item.pubDate;
        document.link = item.link;
        document.text = text;
        sendMessageToQueue(document);
        documents.push(document)
    }));
    // store(documents);
}

module.exports = crawl; 