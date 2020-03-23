/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const cron = require('node-cron');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const schedule = require('./crawl/schedule');
// const consumer = require('./consumer/consumer');
// const consumer1 = require('./consumer/consumer1');
// const consumer2 = require('./consumer/consumer2');
// const consumer3 = require('./consumer/consumer3');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const source = [
  {
    website: 'vnexpress',
    rss: [
      'https://vnexpress.net/rss/tin-moi-nhat.rss',
      'https://vnexpress.net/rss/the-gioi.rss',
      'https://vnexpress.net/rss/thoi-su.rss',
      'https://vnexpress.net/rss/kinh-doanh.rss',
      'https://vnexpress.net/rss/startup.rss',
      'https://vnexpress.net/rss/startup.rss',
    ],
    category: 'Tin tức',
  },
  {
    website: 'vnexpress',
    rss: [
      'https://vnexpress.net/rss/tin-moi-nhat.rss',
      'https://vnexpress.net/rss/the-gioi.rss',
      'https://vnexpress.net/rss/thoi-su.rss',
      'https://vnexpress.net/rss/kinh-doanh.rss',
      'https://vnexpress.net/rss/startup.rss',
      'https://vnexpress.net/rss/startup.rss',
    ],
    category: 'Giải trí',
  },
];

cron.schedule('*/5 * * * *', () => {
  schedule(source);
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/crawler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000, () => {
  console.log('Sever is listening on port 8000');
});
