/* eslint-disable no-proto */
export function findRoot() {
  const arr = document.body.children;
  const ele = Array.prototype.find.call(arr, item => item.__vue__);
  if (!ele) {
    return false;
  }
  return ele.__vue__.$root;
}

export function printCapturedError() {
  const root = findRoot();

  if (!(root && root.__proto__)) {
    return;
  }

  _tcm.originCatch = root.__proto__.$catch;

  root.__proto__.$catch = function (...args: [v?: unknown]) {
    _tcm.originCatch.apply(this, args);
  };
}
