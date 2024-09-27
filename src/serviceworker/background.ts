import { type Run, createBackground } from '~/create/createScript';
import { configObj } from '~/create/configs';
import { dealModules, initExtension } from '~/create/create';

const allBackgroundFiles = require.context('../applets', true, /background\.ts$/);

const modules = allBackgroundFiles.keys().reduce((acc, key) => {
  acc[key] = allBackgroundFiles(key);
  return acc;
}, {});

const backgroundObj = dealModules<Run>(modules);
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

chrome.storage.local.get(EXTENSION_AVAILABLE_STORAGE_KEY, (res) => {
  if (res[EXTENSION_AVAILABLE_STORAGE_KEY]) {
    context.setContext(() => res[EXTENSION_AVAILABLE_STORAGE_KEY]);
  }
});

context.autoRun((context) => {
  chrome.storage.local.set({ [EXTENSION_AVAILABLE_STORAGE_KEY]: context });
});
