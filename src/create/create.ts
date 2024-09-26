import { createContext } from './createContext';
import type { ContextType, ObjectContext, UnMounted } from './interface';
import { AllAppletsMatches, AppletsEnablingContext, configObj } from './configs';
import { PackageNameToConfig, getPathKey } from './const';
import { contextStorage } from './context';

// 把 ContextType<T> 转换为 T
export function convertConfigContextItem<T>(item: T | ObjectContext<T>): T {
  if (item && typeof item === 'object') {
    return 'value' in item ? item.value : item;
  }
  return item;
}
export function convertConfigContext<T>(context: ContextType<T>) {
  const res = {} as T;
  Object.keys(context).forEach((key) => {
    res[key] = convertConfigContextItem(context[key]);
  });
  return res;
}

const EXTENSION_CONTEXT_STORAGE_PREFIX = 'extension_context_storage_';

export const getContextStorageKey = (extensionKey: string, key: string) => EXTENSION_CONTEXT_STORAGE_PREFIX + extensionKey + key;

export function getNeedStorageKeys<T extends Record<string, any>>(context: ContextType<T>) {
  const storageKeys: string[] = [];
  Object.keys(context).forEach((key) => {
    if (context[key] && (context[key] as any).storage) {
      storageKeys.push(key);
    }
  });
  return storageKeys;
}

export function getContextFormStorage<T extends Record<string, any>>(extensionKey: string, context: ContextType<T>, callback: (context: T) => void) {
  const storageKeys = getNeedStorageKeys(context);
  if (!storageKeys.length) {
    return;
  }
  return new Promise((r) => {
    console.log('key', storageKeys.map(k => getContextStorageKey(extensionKey, k)));
    chrome.storage.local.get(storageKeys.map(k => getContextStorageKey(extensionKey, k)), (storageRes) => {
      const res = {} as T;
      Object.keys(context).forEach((key) => {
        // @ts-expect-error
        res[key] = storageRes[getContextStorageKey(extensionKey, key)] || convertConfigContextItem(context[key]);
      });
      callback(res);
      r(res);
    });
  });
}

export function setStorageFromContext<T extends Record<string, any>>(extensionKey: string, configContext: ContextType<T>, newContext: T) {
  const storageKeys = getNeedStorageKeys(configContext);
  if (!storageKeys.length) {
    return;
  }
  const storageData = storageKeys.reduce((res, key) => {
    res[getContextStorageKey(extensionKey, key)] = newContext[key];
    return res;
  }, {});
  return chrome.storage.local.set(storageData);
}

export function dealModules<T>(modules: Record<string, { [key: string]: any }>) {
  return Object.fromEntries(Object.keys(modules).map(path => [PackageNameToConfig[getPathKey(path)]?.key ?? getPathKey(path), modules[path].default as T]));
}

export type InitExtensionRun = (key: string) => UnMounted;

export function initExtension(run: InitExtensionRun) {
  const unMountedList: Record<string, UnMounted> = {};
  let beforeContext = {};

  const extensionAvailableContext = createContext(AppletsEnablingContext, AllAppletsMatches);
  contextStorage.setContext(extensionAvailableContext);

  const unbind = extensionAvailableContext.autoRun((context) => {
    Object.keys(context).forEach((key) => {
      if (context[key].enabled && !beforeContext[key]?.enabled && configObj[key]) {
        unMountedList[key] = run(key);
      }
      if (!context[key].enabled && beforeContext[key]?.enabled && unMountedList[key]) {
        const unmount = unMountedList[key];
        if (unmount instanceof Promise) {
          unmount.then(res => res?.());
        }
        else {
          unmount?.();
        }
      }
    });
    beforeContext = context;
  });

  return {
    unbind,
    context: extensionAvailableContext,
  };
}
