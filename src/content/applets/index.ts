import VCollapse from 'v-collapse-it';
import AppletListContainer from './AppletList.vue';
import { getAppShadowDOM } from '~/content/utils';

export function initAppletList() {
  const appletList = document.createElement('creative-fe-applet-list');

  appletList.style.position = 'fixed';
  appletList.style.top = '0px';
  appletList.style.left = '0px';
  appletList.style.display = 'block';
  appletList.style.height = '100vh';

  appletList.setAttribute('font', 'sans');

  const app = createApp(AppletListContainer);
  app.use(VCollapse, {
    speed: 100,
  });
  app.mount(appletList);

  getAppShadowDOM()?.appendChild(appletList);
}
