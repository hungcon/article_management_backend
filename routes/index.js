var express = require('express');
var router = express.Router();
let Parser = require('rss-parser');
let parser = new Parser();
const rp = require('request-promise');
var cheerio = require('cheerio');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/get-text', function(req, res, next) {
   async function getText(link)  {
    var options =  {
      url: link,
      'User-Agent':  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    }
    var text = await rp(options)
    .then(function(html){
      const $ = cheerio.load(html);
      //console.log($('h1.title_news_detail').text());
      console.log($('article.content_detail').html())
       return $('p.Normal').text();
    })
    .catch(function(err){
      //handle error
    });
    return text;
  }
  (async () => {
    let feed = await parser.parseURL('https://vnexpress.net/rss/tin-moi-nhat.rss');
    var documents = [];
    await Promise.all(feed.items.map(async (item) => {
      const text = await getText(item.link);
      var document = {};
      document.title = item.title;
      document.pubDate = item.pubDate;
      document.link = item.link;
      document.text = text;
      documents.push(document)
    }));
    res.send(JSON.stringify(documents));
  })();
});

router.post('/get-text-dantri', function(req, res, next) {
  async function getText(link)  {
   var options =  {
     url: link,
     'User-Agent':  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
   }
   var text = await rp(options)
   .then(function(html){
     const $ = cheerio.load(html); 
    //   return $('p.Normal').text();
   })
   .catch(function(err){
     //handle error
   });
   return text;
 }
 (async () => {
   let feed = await parser.parseURL('https://vietnamnet.vn/rss/phap-luat.rss');
   var documents = [];
   await Promise.all(feed.items.map(async (item) => {
     const text = await getText(item.link);
     var document = {};
     document.title = item.title;
     document.pubDate = item.pubDate;
     document.link = item.link;
     document.text = text;
     documents.push(document)
   }));
   res.send(JSON.stringify(documents));
 })();
});

router.get('/get-source', function(req, res, next) {
  rp(req.query.url)
  .then(function(html){
    const $ = cheerio.load(html);
        var text, content;
        if($('article.content_detail').html() == null){
            text = $('div.fck_detail').html();
        } else if($('div.fck_detail').html() == null){
            text = $('article.content_detail').html();
        } else {
            text = "";
        }
        content = cheerio.load(text); 
        content('p.Image').remove();
        content('div.block_tinlienquan_temp').remove();
         // xoá table 
         content('table.tbl_insert').remove();
        
        //xoá tác giả 
        content('p').last().remove();
        //content('strong').remove();
        //content('em').remove();
        // return content.text().replace(/\t/g, '').replace(/\n/g, '');
        res.send(content.html())
  })
  .catch(function(err){
    console.log(err)
  })
});

module.exports = router;
