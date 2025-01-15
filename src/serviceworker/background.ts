import { type Run, createBackground } from '~/create/createScript';
import { ALL_APPLET_CONFIGS, configObj } from '~/create/configs';
import { dealModules, initExtension } from '~/create/create';

const allBackgroundFiles = require.context('../applets', true, /background\.ts$/);

const backgroundObj = dealModules<Run>(allBackgroundFiles);
console.log('=>(background.ts:13) backgroundObj', backgroundObj);

const EXTENSION_AVAILABLE_STORAGE_KEY = 'extension_available_storage_key';

// 自动运行background
async function run(key: string) {
  if (backgroundObj[key]) {
    return backgroundObj[key](configObj[key]);
  }
  const func = createBackground(async () => () => {});
  return await func(configObj[key]);
}

const { context } = initExtension(run);

context.autoRun((context) => {
  chrome.storage.local.set({ [EXTENSION_AVAILABLE_STORAGE_KEY]: context });
});
chrome.storage.local.get(EXTENSION_AVAILABLE_STORAGE_KEY, (res) => {
  if (res[EXTENSION_AVAILABLE_STORAGE_KEY]) {
    context.setContext(() => res[EXTENSION_AVAILABLE_STORAGE_KEY]);
  }
  else {
    const newContext = ALL_APPLET_CONFIGS.reduce((obj, item) => {
      return {
        ...obj,
        [item.key]: {
          enabled: item.enabled ?? false,
        },
      };
    }, {});
    context.setContext(() => newContext);
  }
});
