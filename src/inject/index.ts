import { initExtension } from '~/create/create';
import { configObj } from '~/create/configs';
import injectClientAccountScripts from '~/applets/client_accounts/inject';
import { CLIENT_ACCOUNTS_APPLET_KEY } from '~/applets/client_accounts/config';

const injectObj = {
  [CLIENT_ACCOUNTS_APPLET_KEY]: injectClientAccountScripts,
};

initExtension((key) => {
  if (injectObj[key]) {
    return injectObj[key](configObj[key]);
  }
});

const bridge = document.getElementById('inject-content-bridge');

if (bridge) {
  bridge.dataset.test = 'test';

  bridge.click();
}
