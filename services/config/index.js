/* eslint-disable func-names */
const Configuration = require('../../models/configuration');

const getConfiguration = async () => {
  const configuration = await Configuration.find({});
  return configuration;
};

module.exports = { getConfiguration };
