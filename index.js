/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const createError = require('http-errors');
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const followRedirects = require('follow-redirects');

followRedirects.maxRedirects = 10;
followRedirects.maxBodyLength = 500 * 1024 * 1024 * 1024;

const logger = require('morgan');
const cors = require('cors');
const ngrok = require('ngrok');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

require('dotenv').config();
require('./models');

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

const { PORT } = process.env;
const server = http.createServer(app);

global.QUEUE_LINKS = [];
global.TASKS = [];
global.RUNNING_WORKER_FLAG = false;
global.LIST_AUDIO_LINK = [];

server.listen(PORT, () => {
  console.log(`Sever is listening on port ${PORT}`);

  (async function () {
    const url = await ngrok.connect(PORT);
    global.CALLBACK_URL = url;
    console.log(url);
  })();
});

require('./services/crawl').runSchedule();
require('./services/crawl').saveArticle();
