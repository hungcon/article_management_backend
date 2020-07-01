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

// followRedirects.maxBodyLength = 100 * 1024 * 1024;

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

server.listen(PORT, () => {
  console.log(`Sever is listening on port ${PORT}`);

  (async function () {
    const url = await ngrok.connect(PORT);
    global.CALLBACK_URL = url;
    console.log(url);
  })();
});

require('./services/initService').generateAccount();

require('./services/crawlService').runSchedule();

// const listHustLink = [
//   'https://www.hust.edu.vn/tin-tuc-thong-bao',
//   'https://www.hust.edu.vn/hoatdongchung',
//   'https://www.hust.edu.vn/cong-tac-doan-the',
//   'https://www.hust.edu.vn/dao-tao2',
//   'https://www.hust.edu.vn/khoa-hoc-cong-nghe1',
//   'https://www.hust.edu.vn/hop-tac-doi-ngoai-truyen-thong',
//   'https://www.hust.edu.vn/to-chuc-nhan-su',
//   'https://www.hust.edu.vn/thong-bao-moi',
//   'https://www.hust.edu.vn/su-kien-sap-dien-ra',
//   'https://www.hust.edu.vn/thong-bao-dao-tao',
//   'https://www.hust.edu.vn/thong-bao-khoa-hoc-cong-nghe',
//   'https://www.hust.edu.vn/thong-bao-hop-tac-doi-ngoai-truyen-thong',
//   'https://www.hust.edu.vn/thong-bao-to-chuc-nhan-su',
//   'https://www.hust.edu.vn/to-chuc-nhan-su1',
//   'https://www.hust.edu.vn/tuyen-dung',
//   'https://www.hust.edu.vn/thong-bao-sinh-vien',
//   'https://www.hust.edu.vn/thong-bao-khac',
// ];

// listHustLink.forEach((link) => {
//   require('./services/hustService').worker(link);
// });
