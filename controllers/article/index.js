const articleService = require('../../services/article');

const getAllophones = async (req, res) => {
  const { message } = req.body;
  const { articleId, sentenceId } = req.query;

  const status = await articleService.storeAllophones(
    message,
    articleId,
    sentenceId,
  );
  return res.send(status);
};

const getAllophonesOfWords = async (req, res) => {
  const { message } = req.body;
  const { sentenceId, orig, type, index } = req.query;
  const status = await articleService.replaceAllophones(
    message,
    sentenceId,
    orig,
    type,
    index,
  );
  return res.send(status);
};

const getAudioUrl = async (req, res) => {
  const { link } = req.body;
  const { articleId, sentenceId } = req.query;
  const sentenceAudio = {
    link,
    sentenceId,
    articleId,
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
