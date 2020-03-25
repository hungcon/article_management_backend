const cron = require('node-cron');
const schedule = require('./schedule');

const job = () => {
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
};

module.exports = job;
