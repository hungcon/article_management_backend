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

const getAudioUrl = async (req, res) => {
  const { link } = req.body;
  const { cleanArticleId, sentenceId } = req.query;
  const sentenceAudio = {
    link,
    sentenceId,
    cleanArticleId,
  };
  // eslint-disable-next-line no-undef
  LIST_AUDIO_LINK = [...LIST_AUDIO_LINK, sentenceAudio];
  return res.send({ status: 1 });
};

module.exports = {
  getAllophones,
  getAllophonesOfWords,
  getAudioUrl,
};
