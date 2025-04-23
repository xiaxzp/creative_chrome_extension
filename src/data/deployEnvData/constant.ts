export const EXTENSION_ENVIRONMENT_KEY = 'extension_environment';

// 自定义配置，用于记录用户在哪些项目启用环境一键切换
export const CUSTOMIZATION_CONFIG = 'customizationConfig';

// 自定义配置，用于记录用户在哪些项目启用环境一键切换
export const CUSTOMIZATION_CONFIG_USER_SETTING = 'customizationConfigUserSetting';

export const BROWSER_CUSTOM_RULES = 'browserCustomRules';

export enum EnvironmentMessageEvent {
  DeclarativeNetRequest = 'declarativeNetRequest',
  GetHostConfig = 'get_host_config',
  HostHeaderAction = 'host_header_action',
  GetChannelInfoById = 'get_channel_info_by_id',
  BrowserCustomRuleUpdate = 'browser_custom_rule_update',
  BrowserCustomRuleDelete = 'browser_custom_rule_delete',
}

export enum HostHeaderOperation {
  Toggle = 'toggle',
  Add = 'add',
  Delete = 'delete',
}
