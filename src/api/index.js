const aesjs = require('aes-js');
const jssha256 = require('js-sha256');

export const encryptSymmetricCbc = (payloadUtf8, key, ivHex, useSha256) => {
  if (useSha256) {
    key = jssha256.sha256.arrayBuffer(key);
  }
  const payloadBytes = aesjs.utils.utf8.toBytes(payloadUtf8);
  const paddedPayloadBytex = aesjs.padding.pkcs7.pad(payloadBytes);
  const ivBuffer = aesjs.utils.hex.toBytes(ivHex);
  // eslint-disable-next-line
  const aesCtr = new aesjs.ModeOfOperation.cbc(Buffer.from(key), ivBuffer);
  const encryptedBytes = aesCtr.encrypt(paddedPayloadBytex);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
};

export const decryptSymmetricCbc = (encryptedPayloadHex, key, ivVectorHex, useSha256) => {
  if (useSha256) {
    key = jssha256.sha256.arrayBuffer(key);
  }
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedPayloadHex);
  const ivBuffer = aesjs.utils.hex.toBytes(ivVectorHex);
  // eslint-disable-next-line
  const aesCtr2 = new aesjs.ModeOfOperation.cbc(Buffer.from(key), ivBuffer);
  const decryptedBytes = aesCtr2.decrypt(encryptedBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
};

export const generateRandomIvVectorHex = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return aesjs.utils.hex.fromBytes(Buffer.from(result));
};