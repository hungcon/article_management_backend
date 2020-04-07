/* eslint-disable func-names */
const Configuration = require('../../models/configuration');

const getConfiguration = async () => {
  const configuration = await Configuration.find({});
  return configuration;
};

const deleteConfig = async (configId) => {
  await Configuration.findByIdAndDelete(configId);
};

const deleteHtmlConfig = async ({ htmlConfigId, index }) => {
  const htmlIndex = `html.${index}`;
  const condition = {
    _id: htmlConfigId,
  };
  const update = {
    $unset: { [htmlIndex]: 1 },
  };
  const remove = {
    $pull: { html: null },
  };
  await Configuration.findOneAndUpdate(condition, update);
  await Configuration.findOneAndUpdate(condition, remove);
};

module.exports = { getConfiguration, deleteConfig, deleteHtmlConfig };
