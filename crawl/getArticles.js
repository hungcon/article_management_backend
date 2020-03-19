var crawl = require('./crawl');

const getArticles = async (listRSS) => {
    var links = []
    await Promise.all(listRSS.map(async (rss) => {
        var listLink = await crawl(rss);
        // console.log(listLink.length)
        listLink.forEach(link => {
            links.push(link);
        })
    
    }));
    links = links.filter((li, idx, self) => self.map(itm => itm.link).indexOf(li.link) === idx)
    // console.log(links.length)
    return links;
}

module.exports = getArticles;
