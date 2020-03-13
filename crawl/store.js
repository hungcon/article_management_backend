var Article = require('../model/article');

const storeArticle = async (articles) => {
    for (let i = 0; i < articles.length; i++) {
        if(articles[i].text == undefined){
            continue;
        }
        var checkExist = await Article.findOne({title: articles[i].title});
        if(checkExist == null) {
            Article.create(articles[i], function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log('Stored')
                }
            })
        }
    }
};

module.exports = storeArticle;