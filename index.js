/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const createError = require('http-errors');
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const ngrok = require('ngrok');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// require('./services/crawl').runSchedule();
// require('./services/crawl').saveArticle();
// const links = [
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9af3a7b0-a087-11ea-9f9a-3becb1c47cfc.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9cd16860-a087-11ea-b7de-47a15958fef8.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9bd68da0-a087-11ea-955b-094560de4ee7.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9b30d7c0-a087-11ea-83eb-f1ae0cd46788.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9c1a7470-a087-11ea-a268-55649da52751.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9c878e20-a087-11ea-bb1d-a926ed4df28c.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9c753ea0-a087-11ea-9ace-43ed3e4a6126.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9bc1cd20-a087-11ea-9c6d-710406841ed8.wav',
//   'https://store-mp3-file-tts.s3.ap-southeast-1.amazonaws.com/9b0e82b0-a087-11ea-9e60-ef640229a5e1.wav',
// ];
// const title = 'Hưng con đại học';
// // eslint-disable-next-line camelcase
// const cleanArticleId = '123';

// require('./services/audio/join_audio').concatByLink({
//   links,
//   title,
//   cleanArticleId,
// });
