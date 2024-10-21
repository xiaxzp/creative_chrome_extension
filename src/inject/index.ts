import { dealModules, initExtension } from '~/create/create';
import type { Run } from '~/create/createScript';
import { configObj } from '~/create/configs';

const allBackgroundFiles = require.context('../applets', true, /background\.ts$/);

const modules = allBackgroundFiles.keys().reduce((acc, key) => {
  acc[key] = allBackgroundFiles(key);
  return acc;
}, {});
const injectObj = dealModules<Run>(modules);

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
