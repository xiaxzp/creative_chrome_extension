import { initMessager } from '@/messager';
import configs from '@/package-index/config.ts';
import { MATCH_URLS } from '../const/url';

export interface PackageStats {
  [key: string]: {
    on: boolean;
  };
}

export function initController() {
  // 初始化配置
  const controllerStats = Object.keys(configs).reduce((stats, key) => {
    stats[key] = {
      on: configs[key]?.defaultOn,
    };
    return stats;
  }, {}) as PackageStats;
  return initMessager({
    id: 'controller',
    stats: controllerStats,
    namespace: 'controller',
    shouldStore: true,
    matcheURLs: MATCH_URLS,
  });
}
const Controller = initController();

export async function toggleSwitch(name: string, isOn: boolean) {
  await Controller?.manualChangeStats({ ...Controller.stats, [name]: { on: isOn } });
}
export default Controller;
