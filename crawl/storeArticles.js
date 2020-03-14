var Article = require('../model/article');

const storeArticle = async (article) => {
    // if(article.text == undefined){
    //     return;
    // }
    var checkExist = await Article.findOne({title: article.title});
    console.log(checkExist == null)
    if(checkExist == null) {
        Article.create(article, function(err){
            if(err) {
                console.log(err);
            } else {
                console.log('Stored')
            }
        })
    }
};

module.exports = storeArticle;