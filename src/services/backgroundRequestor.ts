import { defineExtensionMessaging, ExtensionMessenger } from '@webext-core/messaging';
import { MATCH_URLS } from '@/const';
function generateEventName(event: string, isResponse = false) {
  return isResponse ? `${event}_response` : `${event}_request`;
}

export function requestBackground<T extends Record<string, any>>(event: string, params: any): Promise<T> {
  const messenger: ExtensionMessenger<T> = defineExtensionMessaging();
  return new Promise((resolve, reject) => {
    const unmount = messenger.onMessage(generateEventName(event, true), (res) => {
      resolve(res.data);
      unmount();
    });
    messenger.sendMessage(generateEventName(event), params);
  });
}

export function responseInBackground<T extends Record<string, any>>(
  event: string,
  cbFunction: (args: T) => Promise<any>,
  matcheURLs: string[] = MATCH_URLS,
) {
  const messenger: ExtensionMessenger<T> = defineExtensionMessaging();
  return messenger.onMessage(generateEventName(event, false), (params) => {
    cbFunction(params.data).then((res) => {
      messenger.sendMessage(generateEventName(event, true), res);
      chrome.tabs.query({ url: matcheURLs }, (tabs) => {
        if (!tabs) {
          return;
        }
        tabs.forEach((tab) => {
          tab.id && messenger.sendMessage(generateEventName(event, true), res, tab.id);
        });
      });
    });
  });
}
