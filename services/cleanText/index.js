/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');
require('dotenv').config();

function transformText(text) {
  try {
    return text
      .toLowerCase()
      .replace(/\n/g, ' ')
      .replace(
        /[!-/:-@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/g,
        ' ',
      )
      .replace(/\s\s+/g, ' ')
      .trim();
  } catch (error) {
    console.log('TEXT', text, 'error', error);
    return null;
  }
}

async function getNormalizedText(inputText) {
  const arrayXml = await getXmlNormalizedText(inputText);
  const normalizedText = parseXml(arrayXml).trim();
  return normalizedText;
}

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

async function getXmlNormalizedText(inputText) {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://pre-deploy.vbeecore.com/process',
      timeout: 10 * 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        INPUT_TYPE: 'TEXT',
        OUTPUT_TYPE: 'WORDS',
        INPUT_TEXT: inputText,
        LOCALE: 'vi_VN',
      }),
    });

    return data;
  } catch (error) {
    return '';
  }
}

const replaceSpace = (text) => {
  const replaceText = text
    .replace(/\s\s+/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\n/g, ' ');
  return replaceText;
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

async function getWords(allophones) {
  const loanwordsInfo = [];
  const abbreviationsInfo = [];
  const $ = cheerio.load(allophones, { xmlMode: true });
  const $mtu = cheerio.load($.html($('mtu')));
  $mtu('body')
    .children()
    // eslint-disable-next-line func-names
    .each(function () {
      if ($(this).attr('nsw') === 'abbreviation') {
        const abbreviation = {
          words: $(this).attr('orig'),
          normalize: [],
          machineNormalize: $(this).children().text().trim(),
          peopleNormalize: $(this).children().text().trim(),
        };
        if (
          !abbreviationsInfo.some((pro) => pro.words === abbreviation.words)
        ) {
          abbreviationsInfo.push(abbreviation);
        }
      }
      if ($(this).attr('nsw') === 'loanword') {
        const loanword = {
          words: $(this).attr('orig'),
          normalize: [],
          machineNormalize: replaceSpace($(this).children().text().trim()),
          peopleNormalize: replaceSpace($(this).children().text().trim()),
        };
        if (!loanwordsInfo.some((pro) => pro.words === loanword.words)) {
          loanwordsInfo.push(loanword);
        }
      }
    });
  return { loanwordsInfo, abbreviationsInfo };
}

module.exports = {
  getNormalizedText,
  parseXml,
  getXmlNormalizedText,
  transformText,
  getWords,
  getAllophones,
  splitSentences,
};
