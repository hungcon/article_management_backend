let Parser = require('rss-parser');
let parser = new Parser();

const crawl = async (rss, category) => {
    let feed = await parser.parseURL(rss);
    var listLink = [];
    feed.items.forEach(item => {
        item.category = category;
        listLink.push(item);
    });
    return listLink;
}

module.exports = crawl; 