var CryptoJS = require("crypto-js");
const key = CryptoJS.enc.Utf8.parse('TUx9nRZxna6ivSjY')
//1接受一个明文对象
//2返回一个 word:{加密字符串}的对象
const aesEncryptObj2Obj = function (obj) { // 加密	
  let word = JSON.stringify(obj)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }) // 加密模式为ECB，补码方式为PKCS5Padding（也就是PKCS7）

  let jsObj = {}
  jsObj.word = encrypted.toString()
  return jsObj //
};

//1接受一个加密字符串
//2返回一个明文字符串或对象	
const aesDecryptText = function (word) { // 解密	
  let jsObj
  if (word !== '') {
    let decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    let str = CryptoJS.enc.Utf8.stringify(decrypt).toString()
    try {
      jsObj = JSON.parse(str)
    } catch (e) {
      jsObj = str
    }
  }
  return jsObj
};

const random = function(N) {return Math.random().toString(36).substring(2, N)};

module.exports = {
    aesEncryptObj2Obj,
    aesDecryptText,
    random
  };