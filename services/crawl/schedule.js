const getArticles = require('./getArticles');
const getText = require('./getText');
const { saveArticlesToQueue } = require('../kafka');

const schedule = async (source) => {
  const listArticles = await getArticles(source);
  for (let i = 0; i < listArticles.length; i += 1) {
    const text = await getText(listArticles[i].link);
    const document = {};
    document.title = listArticles[i].title;
    document.pubDate = listArticles[i].pubDate;
    document.link = listArticles[i].link;
    document.category = listArticles[i].category;
    document.text = text;
    saveArticlesToQueue(document);
  }
};

module.exports = schedule;
