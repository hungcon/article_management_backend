var crawl = require('./crawl');

const getArticles = async (source) => {
    var articles = [];
    for(let i = 0; i < source.length; i++){
        await Promise.all(source[i].rss.map(async (rss) => {
            var listArticles = await crawl(rss, source[i].category);
            listArticles.forEach(article => {
                articles.push(article);
            });
        }));
    }
    articles = articles.filter((li, idx, self) => self.map(itm => itm.link+itm.category).indexOf(li.link+li.category) === idx);
    return articles;
}

module.exports = getArticles;
