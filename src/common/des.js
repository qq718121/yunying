import CryptoJS from 'crypto-js'

export const setDAesString = function (data, keys) {
     // let baseTen = res.data.slice(0,10);
     // let baseThree = res.data.slice(30,res.data.length);
     // let base64Str = baseTen + baseThree;
     //私钥
     let key = CryptoJS.enc.Utf8.parse("yhgt!d%sd*aw%dSDSFSsa#mng~dsq");
     let iv = CryptoJS.enc.Utf8.parse("yhgt!d%sd*aw%dSDSFSsa#mng~dsq");
     // Triple DES 加密
     let encrypted = CryptoJS.TripleDES.encrypt(data, key, {
          iv: iv,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
     });
     //                转换为字符串
     encrypted = encrypted.toString();
     return encrypted;
};
export const getDAesString = function (res, keys) {
     let baseTen = res.slice(0, 10);
     let baseThree = res.slice(30, res.length);
     let base64Str = baseTen + baseThree;
     //私钥
     let key = CryptoJS.enc.Utf8.parse("yhgt!d%sd*aw%dSDSFSsa#mng~dsq");
     let iv = CryptoJS.enc.Utf8.parse("yhgt!d%sd*aw%dSDSFSsa#mng~dsq");
     // Triple DES 加密
     //               var encrypted = this_.$CryptoJS.TripleDES.encrypt(str, key, {
     //                 iv: iv,
     //                 mode: this_.$CryptoJS.mode.ECB,
     //                 padding: this_.$CryptoJS.pad.Pkcs7
     //               });
     //
     ////                转换为字符串
     //               encrypted = encrypted.toString();
     //               console.log(encrypted);
     // Triple DES 解密
     //               let encrypted='U2FsdGVkX19qa+f0Zw2OqgVV8zBTK3lSLjhfmIaufMk=';
     let decrypted = CryptoJS.TripleDES.decrypt(base64Str, key, {
          iv: key,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
     });
     // 转换为 utf8 字符串
     return decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
};
export const desc = function (str, keys) {
     var timestamp = setDAesString(
          new Date().getTime().toString(),
          keys
     ).slice(0, 20);
     var data = setDAesString(str, "yhgt!d%sd*aw%dSDSFSsa#mng~dsq");
     var tata = data.slice(0, 10);
     var tata1 = data.slice(10, data.length);
     var data1 = tata + timestamp + tata1;
     return data1;
};