import { onMessage } from 'webext-bridge';
import type { ContentMessage } from '~/hooks/content';

interface Options<T> {
  key: string
  tabId: number
  default?: T | undefined
}

export const TabContentMessageType = 'request-set-tab-content';
export const TabBackgroundMessageType = 'request-set-tab-background';

const tabContent = {};

function getTabContentKey(key, tabId) {
  return `__${key}${tabId}__`;
}

export function listenerContentMessage() {
  onMessage(TabBackgroundMessageType, ({ sender, data }) => {
    const contentKey = getTabContentKey(data.key, sender.tabId);
    tabContent[contentKey] = data.content;
  });
}

/** send message to specify tab */
export function setTabContent<T = Record<string, any>>(
  options: Options<T>,
  setContent: (content?: T) => T,
) {
  const { key, tabId } = options;
  const contentKey = getTabContentKey(key, tabId);
  const cacheContent = tabContent[contentKey] ?? options.default;
  const content = setContent(cacheContent);
  tabContent[contentKey] = content;
  const data: ContentMessage = {
    key,
    value: content,
    type: TabContentMessageType,
  };

  chrome.tabs.sendMessage(tabId, data);
}
