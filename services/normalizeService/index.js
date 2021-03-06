/* eslint-disable no-undef */
const axios = require('axios');
require('dotenv').config();

const { ARTICLE_SERVICE_DOMAIN } = process.env;

const splitSentences = async (text) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      timeout: 10 * 1000,
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:063332792662:function:serverless-split-release-hello',
        text,
        input_text: 'A',
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

const getAllophones = async (text, paragraphId, sentenceId, appId, bitRate) => {
  try {
    console.log(
      `${ARTICLE_SERVICE_DOMAIN}/get-allophones?paragraphId=${paragraphId}&sentenceId=${sentenceId}`,
    );
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      timeout: 10 * 1000,
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:063332792662:function:serverless-tts-vbee-2020-06-03-tts',
        input_text: text,
        rate: 1,
        voice: 'vbee-tts-voice-hn_male_manhdung_news_48k-h',
        bit_rate: bitRate,
        user_id: '46030',
        app_id: appId,
        input_type: 'TEXT',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'ALLOPHONES',
        call_back: `${ARTICLE_SERVICE_DOMAIN}/get-allophones?paragraphId=${paragraphId}&sentenceId=${sentenceId}`,
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

const getAudioSentenceLink = async (
  allophones,
  paragraphId,
  paragraphIndex,
  articleId,
  sentenceId,
  voice,
  bitRate,
  appId,
) => {
  try {
    console.log(
      `${ARTICLE_SERVICE_DOMAIN}/get-audio-url?articleId=${articleId}&paragraphId=${paragraphId}&paragraphIndex=${paragraphIndex}&sentenceId=${sentenceId}`,
    );
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      timeout: 10 * 1000,
      data: {
        input_text: allophones,
        rate: 1,
        voice,
        bit_rate: bitRate,
        user_id: '46030',
        app_id: appId,
        input_type: 'ALLOPHONES',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'AUDIO',
        call_back: `${ARTICLE_SERVICE_DOMAIN}/get-audio-url?articleId=${articleId}&paragraphId=${paragraphId}&paragraphIndex=${paragraphIndex}&sentenceId=${sentenceId}`,
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

const getNormalizeWord = async (
  id,
  expansion,
  index,
  word,
  type,
  articleId,
  bitRate,
  appId,
) => {
  word = escape(word);
  console.log(
    `${ARTICLE_SERVICE_DOMAIN}/get-allophones-of-words?articleId=${articleId}&sentenceId=${id}&orig=${word}&type=${type}&index=${index}`,
  );
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:063332792662:function:serverless-tts-vbee-2020-06-03-tts',
        input_text: expansion,
        rate: 1,
        voice: 'vbee-tts-voice-hn_male_manhdung_news_48k-h',
        bit_rate: bitRate,
        user_id: '46030',
        app_id: appId,
        input_type: 'TEXT',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'ALLOPHONES',
        call_back: `${ARTICLE_SERVICE_DOMAIN}/get-allophones-of-words?articleId=${articleId}&sentenceId=${id}&orig=${word}&type=${type}&index=${index}`,
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

module.exports = {
  getAllophones,
  splitSentences,
  getAudioSentenceLink,
  getNormalizeWord,
};
