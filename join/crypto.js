var crypto = require('crypto');

/* 아무도 알지 못하는 나만의 비밀 키 */
var key = 'secret password crypto';

function makeHash(myPass) {
  return crypto.createHash('sha1').update(myPass).digest('hex');
}


module.exports = crypto;
