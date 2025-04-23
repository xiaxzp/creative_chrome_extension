// import Controller from '@/controller';
// import { createApp } from 'vue';
import { getContainer, ControlCenterContainerID } from '@/utils/webContainer.ts';
// import TheButton from './TheButton.vue';
// import { VueQueryPlugin } from "vue-query";
import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import App from './center';
import { ContentScriptContext } from '#imports';

export function initControlsCenter(ctx: ContentScriptContext) {
  // const homeControlRoot = document.createElement('home-control');
  let rootDom: Root;
  // createApp(TheButton).use(VueQueryPlugin).mount(homeControlRoot);
  getContainer(ControlCenterContainerID, ctx).then((cnt) => {
    rootDom = ReactDOM.createRoot(cnt);
    rootDom.render(App);
  });
  return () => {
    rootDom?.unmount();
  };
  // getContaienr(ControlCenterContainerID)?.appendChild(homeControlRoot);
}

export default initControlsCenter;
