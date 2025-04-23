// ExtEnvironmentStorage
import type { BROWSER_CUSTOM_RULES, CUSTOMIZATION_CONFIG, CUSTOMIZATION_CONFIG_USER_SETTING } from './constant';
import type { Host, CustomizationConfigs, CustomizationConfigItem, RuleOmitId } from '@/services/deployEnv';
import type { DeployEnvironment } from '@/types/env';
export interface CustomizationUserSettingItem {
  environmentList: {
    environment: DeployEnvironment;
    headers: string[];
  }[];
  enableEnvironment?: DeployEnvironment;
  enableHeaderVal?: string;
}

export type CustomizationUserSettings = Record<Host, CustomizationUserSettingItem>;

export type BrowserCustomRule = {
  createTime: number; // id
  rule: RuleOmitId;
  enable: boolean;
  updateTime?: number;
  tags?: { name: string; color: string }[];
};

export interface DeployEnvData {
  [CUSTOMIZATION_CONFIG]: CustomizationConfigs;
  [CUSTOMIZATION_CONFIG_USER_SETTING]: CustomizationUserSettings;
  [BROWSER_CUSTOM_RULES]: BrowserCustomRule[];
}
export const DeployEnvDataID = 'DeployEnvDataID';
