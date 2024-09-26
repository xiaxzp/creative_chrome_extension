import type { AppletConfig } from './interface';
import { PackageNameToConfig } from './const';

export const ALL_APPLET_CONFIGS = Object.values(PackageNameToConfig);
export const ExtensionAvailableKey = 'extension_available';
export const configObj: Record<string, AppletConfig> = ALL_APPLET_CONFIGS.reduce((res, item) => {
  res[item.key] = item;
  return res;
}, {});

export type AppletEnablingContextItem = {
  enabled: boolean
}

export const AppletsEnablingContext = {
  key: ExtensionAvailableKey,
  default: Object.keys(configObj).reduce<Record<string, AppletEnablingContextItem>>((res, key) => {
    res[key] = {
      enabled: Boolean(configObj[key].enabled),
    };
    return res;
  }, {}),
};

export const AllAppletsMatches = Array.from(new Set(
  Object.values(configObj).map(item => item.matches || []).flat(),
));

/**
 * Filter extensions meet their`config.matches` rules
 */
export function filterConfigsByMatches(conf: AppletConfig) {
  return conf.matches?.some((glob) => {
    const hostname = (new URL(glob)).hostname;
    const pattern = new URLPattern({ hostname });

    return pattern.test(location.href);
  }) ?? true;
}

export default ALL_APPLET_CONFIGS;
