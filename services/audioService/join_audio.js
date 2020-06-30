/* eslint-disable new-cap */
/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable camelcase */

const { Buffer } = require('buffer');
const axios = require('axios');
const FormData = require('form-data');
const { get_byte } = require('./util');

const reads = [
  ['ChunkID', 'uinteger', 4],
  ['ChunkSize', 'uinteger', 4],
  ['Format', 'uinteger', 4],
  ['Subchunk1ID', 'uinteger', 4],
  ['Subchunk1Size', 'uinteger', 4],
  ['AudioFormat', 'integer', 2],
  ['NumChannels', 'integer', 2],
  ['SampleRate', 'uinteger', 4],
  ['ByteRate', 'uinteger', 4],
  ['BlockAlign', 'integer', 2],
  ['BitsPerSample', 'integer', 2],
  ['Subchunk2ID', 'uinteger', 4],
  ['Subchunk2Size', 'uinteger', 4],
];

function read_wav(buffer) {
  return read_wav_queue(buffer);
}
function read_wav_queue(buffer, pointer = 0, i = 0, read_result = {}) {
  const read = reads[i];
  i += 1;
  if (read[1] === 'string') {
    read_result[read[0]] = buffer.toString('ascii', pointer, pointer + read[2]);
    pointer += read[2];
  } else if (read[1] === 'integer') {
    read_result[read[0]] = buffer.readUInt16LE(pointer, read[2]);
    pointer += read[2];
  } else if (read[1] === 'uinteger') {
    read_result[read[0]] = buffer.readInt32LE(pointer, read[2]);
    pointer += read[2];
  }
  if (i < reads.length) {
    return read_wav_queue(buffer, pointer, i, read_result);
  }
  return read_result;
}

function concatWav(wavs_input) {
  let Subchunk2SizeTotal = 0;
  const bufSize = Buffer.alloc(4);
  try {
    for (const wav of wavs_input) {
      const wav_info = read_wav(wav);
      Subchunk2SizeTotal += wav_info.Subchunk2Size;
    }
    bufSize.writeInt32LE(Subchunk2SizeTotal, 0);
  } catch (e) {
    console.log('writeInt32 out of range');
    console.log(e.message);
    bufSize.writeInt32LE(2047483647, 0);
  }
  const bytes_return = Buffer.concat([
    wavs_input[0].slice(0, 40),
    bufSize,
    ...wavs_input.map((e) => e.slice(44)),
  ]);
  return bytes_return;
}

async function concatByLink({ links, articleId }) {
  try {
    const list_byte_array = await Promise.all(
      links.map((link) => get_byte(link)),
    );
    const bytes = concatWav(list_byte_array);
    const formData = new FormData();
    formData.append('file', bytes, { filename: `${articleId}.wav` });
    const options = {
      method: 'POST',
      url: `${process.env.UPLOAD_SERVICE_DOMAIN}/api/v1/uploads/file?fileName=${articleId}.wav`,
      headers: formData.getHeaders(),
      data: formData,
    };
    const { data } = await axios(options);
    const filePath = data.result.link.replace(/\\/g, '/');
    return filePath;
  } catch (error) {
    return '';
  }
}

module.exports = {
  concatByLink,
};
