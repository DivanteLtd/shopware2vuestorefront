const request = require('axios')
const { protocol, host, version, prefix, token, user, password } = require('../../../config').api
const getToken = () => {
  //const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
  let credentials = `${user}:${password}`

  //console.log( Base64.encode(credentials))
  //return Base64.encode(credentials)

  return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjhhYmZjZjIwYjRlYjQ5YzQ2YWIzODViMjZkMTJlZWQ1MDgxY2NjZDFjYWQyMGE3NjZlNjg3OTNlZDMyNzdkZWU0YzA0MGMyN2MxY2RiMzExIn0.eyJhdWQiOiJhZG1pbmlzdHJhdGlvbiIsImp0aSI6IjhhYmZjZjIwYjRlYjQ5YzQ2YWIzODViMjZkMTJlZWQ1MDgxY2NjZDFjYWQyMGE3NjZlNjg3OTNlZDMyNzdkZWU0YzA0MGMyN2MxY2RiMzExIiwiaWF0IjoxNTU3NzM2NDkxLCJuYmYiOjE1NTc3MzY0OTEsImV4cCI6MTU1Nzc0MDA5MSwic3ViIjoiYmY5M2U2YjlmYTM4NDk4MDg1ZTc3YmIxZjYyZGJlYTciLCJzY29wZXMiOlsid3JpdGUiLCJ3cml0ZSIsIndyaXRlIiwid3JpdGUiXX0.i0Sic0eHoRQuH51Ut1WsrBjeQdettJD3Gzi8Dw20ZmN57Nq7NfIRwH7P7tje31IdxV1StqTqhNpH8SC6AgayjzHKpC-_suqOH0x0BcmAlUu-lqqjisM9z6duGpD2BbsUJmpfHQLUH_E9GyGdwz5OtaBkoDHoTlX1HYSFX1SdNWIHsmKK4DrcfOVpT3BCt5vlK_6YY3S8izxtKjMDyTb6L4ChdejkeCwt5CEAMzy2a_-sGbL3kLB2oeVdQZFH3Nx1jKf35ZiUt3vgFajHjlw8ZSYoaqvTEqXYDScdNUOAmyZxotQbRbEVT4JmSPAScp47s_0RkOWNYySw3M37awdoRA'
}

const getAuthHeaders = () => ({'headers': {'Authorization': `${getToken()}` }})
const getRequestUri = () => `${protocol}://${host}/api/${version}`
const getUrl = (endpoint) => `${getRequestUri()}/${endpoint}`

const getAdmin = async endpoint => {
  return request.get(getUrl(endpoint), getAuthHeaders())
}
const postAdmin = (endpoint, data) => request.post(getUrl(endpoint), data, getAuthHeaders())

module.exports = {
  getAdmin,
  postAdmin,
}