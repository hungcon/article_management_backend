const articleService = require('../../services/article');

const getAllophones = async (req, res) => {
  const { message } = req.body;
  const { cleanArticleId, sentenceId } = req.query;

  const status = await articleService.storeAllophones(
    message,
    cleanArticleId,
    sentenceId,
  );
  return res.send(status);
};

const getAllophonesOfWords = async (req, res) => {
  const { message } = req.body;
  const { sentenceId, position, orig, type } = req.query;
  const status = await articleService.replaceAllophones(
    message,
    sentenceId,
    position,
    orig,
    type,
  );
  return res.send(status);
};

module.exports = {
  getAllophones,
  getAllophonesOfWords,
};
