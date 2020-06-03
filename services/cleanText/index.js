/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const splitSentences = async (text) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      timeout: 10 * 1000,
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:279297658413:function:serverless-split-release-hello',
        text,
        input_text: 'A',
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

const getAllophones = async (text, cleanArticleId, sentenceId) => {
  try {
    console.log(
      `${CALLBACK_URL}/get-allophones?cleanArticleId=${cleanArticleId}&sentenceId=${sentenceId}`,
    );
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      timeout: 10 * 1000,
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:279297658413:function:serverless-tts-vbee-2020-04-26-tts',
        input_text: text,
        rate: 1,
        voice: 'vbee-tts-voice-hn_male_manhdung_news_48k-h',
        bit_rate: '128000',
        user_id: '46030',
        app_id: '5b8776d92942cc5b459928b5',
        input_type: 'TEXT',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'ALLOPHONES',
        call_back: `${CALLBACK_URL}/get-allophones?cleanArticleId=${cleanArticleId}&sentenceId=${sentenceId}`,
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

const getAudioSentenceLink = async (
  allophones,
  cleanArticleId,
  sentenceId,
  voice,
) => {
  try {
    console.log(
      `${CALLBACK_URL}/get-audio-url?cleanArticleId=${cleanArticleId}&sentenceId=${sentenceId}`,
    );
    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      timeout: 10 * 1000,
      data: {
        input_text: allophones,
        rate: 1,
        voice,
        bit_rate: '128000',
        user_id: '46030',
        app_id: '5b8776d92942cc5b459928b5',
        input_type: 'ALLOPHONES',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'AUDIO',
        call_back: `${CALLBACK_URL}/get-audio-url?cleanArticleId=${cleanArticleId}&sentenceId=${sentenceId}`,
      },
    });
    return data;
  } catch (error) {
    return '';
  }
};

async function parseXml(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  //  = transformText(
  const text = $('maryxml')
    .text()
    .replace(/\s\s+/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\./g, '.\n\n')
    .replace(/\n/g, '')
    .trim();
  // );
  return text;
}
module.exports = {
  parseXml,
  getAllophones,
  splitSentences,
  getAudioSentenceLink,
};
