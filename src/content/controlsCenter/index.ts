import { createApp } from 'vue';
import { VueQueryPlugin } from 'vue-query';
import { getAppShadowDOM } from '../utils';
import TheButton from './TheButton.vue';

export function initControlsCenter() {
  const homeControlRoot = document.createElement('home-control');

  createApp(TheButton).use(VueQueryPlugin).mount(homeControlRoot);

  getAppShadowDOM()?.appendChild(homeControlRoot);
}
