const articleService = require('../../services/articleService');

const getAllophones = async (req, res) => {
  const { message } = req.body;
  const { paragraphId, sentenceId } = req.query;

  const status = await articleService.storeAllophones(
    message,
    paragraphId,
    sentenceId,
  );
  return res.send(status);
};

const getAllophonesOfWords = async (req, res) => {
  const { message } = req.body;
  const { sentenceId, orig, type, index, articleId } = req.query;
  const status = await articleService.replaceAllophones(
    message,
    sentenceId,
    orig,
    type,
    index,
    articleId,
  );
  return res.send(status);
};

const getAudioUrl = async (req, res) => {
  const { link } = req.body;
  const { paragraphId, paragraphIndex, articleId, sentenceId } = req.query;
  const status = await articleService.saveAudioUrl(
    link,
    paragraphId,
    paragraphIndex,
    articleId,
    sentenceId,
  );
  return res.send(status);
};

module.exports = {
  getAllophones,
  getAllophonesOfWords,
  getAudioUrl,
};
