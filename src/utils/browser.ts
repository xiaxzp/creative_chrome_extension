/**
 * Inject scripts inside extension
 */

export function injectExtensionBuiltInJS(path?: string) {
  if (!path) {
    throw new Error('Please specify the file path!');
  }

  const script = document.createElement('script');

  script.setAttribute('type', 'text/javascript');

  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  script.src = browser.runtime.getURL(path);

  document.body.appendChild(script);
}

export function getExtensionAssetPath(path?: string) {
  return path ? browser.runtime.getURL(path) : '';
}

export function getExtensionBuiltInStyle(path: string) {
  if (!path) {
    throw new Error('Please specify the file path!');
  }

  const styleEl = document.createElement('link');
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute('href', browser.runtime.getURL(path));

  return styleEl;
}

export function injectExtensionBuiltInStyle(path: string) {
  if (!path) {
    throw new Error('Please specify the file path!');
  }

  document.head.appendChild(getExtensionBuiltInStyle(path));
}
