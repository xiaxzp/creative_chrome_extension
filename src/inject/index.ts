import { dealModules, initExtension } from '~/create/create';
import type { Run } from '~/create/createScript';
import { configObj } from '~/create/configs';

const injectFiles = require.context('../applets', true, /inject\.ts$/);

const injectObj = dealModules<Run>(injectFiles);

initExtension(async (key) => {
  if (injectObj[key]) {
    return injectObj[key](configObj[key]);
  }
});

const bridge = document.getElementById('inject-content-bridge');

if (bridge) {
  bridge.dataset.test = 'test';

  bridge.click();
}
