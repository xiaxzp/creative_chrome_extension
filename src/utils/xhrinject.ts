const xmlorigin_send = window.XMLHttpRequest.prototype.send;

function newXHRSend(cb) {
  const newsend = (data) => {
    if (cb) {
      cb(this, data);
    }
    xmlorigin_send.call(this, data);
  };
  return newsend;
}
function replaceXHR(cb) {
  window.XMLHttpRequest.prototype.send = newXHRSend(cb);
}

declare global {
  interface Window {
    replaceXHR?: any
  }
}

window.replaceXHR = replaceXHR;

export default {};
