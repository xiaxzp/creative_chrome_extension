export class DelayPromise {
  settled = false;
  promise: Promise<unknown>;

  resolve: (v?: unknown) => unknown = () => {};
  reject: (v?: unknown) => unknown = () => {};

  constructor() {
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}

export class DelayPromiseFactory {
  promiseStore: Record<string | number, DelayPromise> = {};
  constructor() {
    this.promiseStore = {};
  }

  buildPromise(key: string | number): DelayPromise {
    if (!this.promiseStore[key]) {
      this.promiseStore[key] = new DelayPromise();
    }
    return this.promiseStore[key] as DelayPromise;
  }

  getPromise(key: string | number) {
    return this.buildPromise(key).promise;
  }

  getSettled(key: string | number) {
    return this.buildPromise(key).settled;
  }

  setPromise(key: string | number, resdata: unknown) {
    this.buildPromise(key).settled = true;
    return this.buildPromise(key).resolve(resdata);
  }

  resetPromise(key: string | number) {
    this.promiseStore[key] = new DelayPromise();
  }
}

export const defaultConfig = {
  log: {},
  starling: {},
  account: {},
  accountConfig: {},
};

// 默认配置
export function getBackgroundPage() {
  return chrome.extension.getBackgroundPage();
}
export function getStorage(keys = defaultConfig, cb: (v?: unknown) => unknown) {
  chrome.storage.local.get(keys, cb);
}
export function setStorage(
  data: Record<string, unknown>,
  cb: (v?: unknown) => unknown,
) {
  chrome.storage.local.set(data, cb);
}
