var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cron = require('node-cron');
var crawl = require('./crawl/crawl');
var schedule = require('./crawl/schedule');
var consumer = require('./consumer/consumer');
var consumer1 = require('./consumer/consumer1');
var consumer2 = require('./consumer/consumer2');
var consumer3 = require('./consumer/consumer3');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var source = [
  {
    website: "vnexpress",
    rss: [
      'https://vnexpress.net/rss/tin-moi-nhat.rss',
      'https://vnexpress.net/rss/the-gioi.rss',
      'https://vnexpress.net/rss/thoi-su.rss',
      'https://vnexpress.net/rss/kinh-doanh.rss',
      'https://vnexpress.net/rss/startup.rss',
      'https://vnexpress.net/rss/startup.rss'
    ],
    category: "Tin tức"
  },
  {
    website: "vnexpress",
    rss: [
      'https://vnexpress.net/rss/tin-moi-nhat.rss',
      'https://vnexpress.net/rss/the-gioi.rss',
      'https://vnexpress.net/rss/thoi-su.rss',
      'https://vnexpress.net/rss/kinh-doanh.rss',
      'https://vnexpress.net/rss/startup.rss',
      'https://vnexpress.net/rss/startup.rss'
    ],
    category: "Giải trí"
  }
];

// schedule(source)

cron.schedule('*/15 * * * *', () => {
  schedule(source)
})

// cron.schedule('*/15 * * * * *', () => {
  // crawl('https://vnexpress.net/rss/tin-moi-nhat.rss');
  // crawl('https://vnexpress.net/rss/thoi-su.rss');
  // crawl('https://vnexpress.net/rss/the-gioi.rss');
  // crawl('https://vnexpress.net/rss/kinh-doanh.rss');
  // crawl('https://vnexpress.net/rss/startup.rss');
  // crawl('https://vnexpress.net/rss/giai-tri.rss');
  // crawl('https://vnexpress.net/rss/the-thao.rss');
  // crawl('https://vnexpress.net/rss/phap-luat.rss');
  // crawl('https://vnexpress.net/rss/giao-duc.rss');
  // crawl('https://vnexpress.net/rss/suc-khoe.rss');
// });


  consumer();

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/crawler', {useNewUrlParser: true, useUnifiedTopology: true});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
