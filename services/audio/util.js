/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const fetch = require('node-fetch');
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

function generateUuid() {
  const d = new Date();

  return `${d.getTime()}${Math.random().toString()}${Math.random().toString()}${Math.random().toString()}`;
}

async function get_byte(url) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const data = await fetch(url, {
    headers,
    method: 'GET',
  })
    .then((res) => res.buffer())
    .catch((error) => {
      console.log('error', error);
      return '';
    });
  return data;
}

const savefile = async (content, full_file) => {
  // const file_save = generateUuid();
  return new Promise((resolve, reject) => {
    fs.writeFile(`${full_file}`, content, function (err) {
      if (err) {
        console.log('save file error ', err);
        return console.log(err);
      }
      resolve(`${full_file}`);
      // console.log("save file done ", `${PATH_UPLOAD}/${file_save}.${fileTyoe}`)
    });
  });
};

module.exports = {
  get_byte,
  savefile,
  generateUuid,
};
