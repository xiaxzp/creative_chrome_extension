import { initMessager } from '@/messager';
import { DeployEnvDataID, DeployEnvData } from './types';
import { CUSTOMIZATION_CONFIG, CUSTOMIZATION_CONFIG_USER_SETTING, BROWSER_CUSTOM_RULES } from './constant';
export function initDeployEnvData() {
  // 初始化配置
  const initStats: DeployEnvData = {
    [CUSTOMIZATION_CONFIG]: {},
    [CUSTOMIZATION_CONFIG_USER_SETTING]: {},
    [BROWSER_CUSTOM_RULES]: [],
  };
  return initMessager({
    id: DeployEnvDataID,
    stats: initStats,
    namespace: DeployEnvDataID,
    shouldStore: true,
    // matcheURLs: MATCH_URLS,
  });
}
const deployEnvData = initDeployEnvData();
export default deployEnvData;
