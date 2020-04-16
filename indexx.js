window.initData = function () {
  let href = window.location.href;
  console.log(href);
  if (!href || !(href + "").startsWith("http://192.168.16.200")) {
    console.log("yuming");
    // return;
  }
  const S = '5iuqHMwIUJ7OhB0WaFMFY8M1TxI9WICR';
  const KEY = CryptoJS.enc.Utf8.parse(S);
  const options = {
    iv: CryptoJS.enc.Utf8.parse('ABCDEF1234123412'),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };
  // const baseURL ='http://powerpay.ngrok.xiaomiqiu.cn';
  const baseURL = 'https://www.fuckbug.xyz/imageapp';
  // const baseURL ='http://localhost:3000/';
  const h = axios.create({
    baseURL
  });
  const encryptBody = function (body) {
    let bodyStr = JSON.stringify(body);
    var encrypted = CryptoJS.AES.encrypt(bodyStr, KEY, options);
    return encrypted.toString();
  };
  h.interceptors.request.use(function(config){
    if (config.method === 'post') {
      let timestamp = new Date().getTime();
      let param = encryptBody(config.data);
      let localSign = md5(`${S}_${param}_${timestamp}`)
      config.data = qs.stringify({ "param": param })
      config.headers.sign = localSign;
      config.headers.time = timestamp;
    }
    return config;
  }, function(error){
    return Promise.reject(error)
  });
  h.interceptors.response.use(function(data){
    let decryptedStr = CryptoJS.AES.decrypt(data.data, KEY, options).toString(CryptoJS.enc.Utf8);
    let resp = JSON.parse(decryptedStr);
    return resp
  }, function(error){
    return Promise.reject(error)
  });
  window.http = h;
};