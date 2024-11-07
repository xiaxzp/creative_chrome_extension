import { camelCase } from 'lodash-es';
import type { AppletConfig } from './interface';

// generate event key
export function getEventContextKey(event: string) {
  return `${camelCase(event)}Event`;
}

const configModules = require.context('../applets', true, /config\.ts$/);
// export const LoadConfigModules = require.context('../applets', true, /config\.ts$/);

const LoadConfigModules = configModules.keys().reduce((acc, key) => {
  acc[key] = configModules(key);
  return acc;
}, {});

// get package name from path
export function getPathKey(path: string) {
  const match = path.match(/\.\/([^/]+)\//);
  // const configFile = path.replace(/\/[^\/]+\.[^\/]+$/, '/config.ts');
  return match ? match[1] : path;
}

// package name : package config
export const PackageNameToConfig = Object.keys(LoadConfigModules).reduce((res, key) => ({
  ...res,
  [getPathKey(key)]: LoadConfigModules[key].default as AppletConfig,
}), {} as Record<string, AppletConfig>);
