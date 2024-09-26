import { initControlsCenter } from './controlsCenter';
import { initAppletList } from './applets';
import { ELEMENT_UI_PORTAL_ID, getAppShadowDOM, prepareAppShadowDOM } from './utils';
import { initExtension } from '~/create/create';
import {
  getExtensionBuiltInStyle,
  injectExtensionBuiltInJS,
} from '~/utils/browser';
import 'urlpattern-polyfill';
import 'element-plus/theme-chalk/el-popper.css';
import 'element-plus/theme-chalk/el-message.css';
import 'uno.css';
import { checkIsInDevtools } from '~/env';

const loadingPromise = new Promise((resolve) => {
  document.addEventListener('DOMContentLoaded', () => {
    resolve('loaded');
  });
});

/**
 * === Load And Run Content JS ===
 */
const { unbind } = initExtension(() => {
  // 如果以后每个 applet 有导出的需要懒启动的函数，可以在此启动
});

window.onbeforeunload = () => {
  unbind();
};

/**
 * === Load Inject JS ===
 */
loadingPromise.then(() => {
  injectExtensionBuiltInJS('inject/inject.js');
});

/**
 * === Load CSS Houdini(s) ===
 */
if ('CSS' in window) {
  // @Note: CSS.paintWorklet 只在 https 和 localhost 下存在
}

let bridgeEle: HTMLElement;

// 插入一个空 DOM 用来 inject 和 content script 通信
function prepareInjectContentBridgeDOM() {
  bridgeEle = document.createElement('creative-devtool-bridge');
  bridgeEle.id = 'inject-content-bridge';
  bridgeEle.style.pointerEvents = 'none';
  bridgeEle.style.visibility = 'hidden';

  document.body.append(bridgeEle);
}

export function getInjectContentBridge() {
  return bridgeEle;
}

/**
 * === Initialize Applets ===
 */

function insertContentStyles() {
  // Element 用了 root 选择器来注入 CSS 变量，在插件的 shadowDOM 无效，所有以我们自己重写了下
  getAppShadowDOM().appendChild(getExtensionBuiltInStyle('lib/reset.css'));
  getAppShadowDOM().appendChild(getExtensionBuiltInStyle('lib/element-fix.css'));
  getAppShadowDOM().appendChild(getExtensionBuiltInStyle('content/content.css'));
}

/** Some fixes for Element UI style working correctly inside shadow-dom  */

function prepareElementPopperPortal() {
  const portal = document.createElement('div');
  portal.style.width = '100vw';
  portal.id = ELEMENT_UI_PORTAL_ID;

  getAppShadowDOM().append(portal);
}

loadingPromise.then(() => {
  if (checkIsInDevtools()) {
    return;
  }

  prepareInjectContentBridgeDOM();

  prepareAppShadowDOM();

  prepareElementPopperPortal();

  insertContentStyles();

  initControlsCenter();

  initAppletList();
});
