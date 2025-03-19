/**
 * Cookie getter
 * @param {string} name
 * @returns {string} String
 */
function getCookie(name) {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; ++i) {
    var pair = cookies[i].trim().split("=");
    if (pair[0] == name) return pair[1];
  }
}

/**
 * Cookie setter
 * @param {string} name
 * @param {*} value Stringified argument
 * @param {array} expireIn [day, hour, minute, second]
 */
function setCookie(name, value = "", expireIn = [0, 1, 0, 0]) {
  var expire = new Date();
  let [day, hour, minute, second] = [...expireIn];
  expire.setTime(
    expire.getTime() + (((day * 24 + hour) * 60 + minute) * 60 + second) * 1000
  );
  document.cookie = `${name}=${JSON.stringify(
    value
  )}; expires=${expire.toUTCString()}`;
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
}

export { getCookie, setCookie, deleteCookie };
