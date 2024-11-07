export type UnMounted = (() => void) | void
export type ObjectContext<T> = {
  storage?: boolean
  value: T
}

export type ContextType<T> = {
  [key in keyof T]: ObjectContext<T[key]> | T[key];
}

/**
 * 子应用 Enabled 生效范围，可选：
 * 1. Session 维度 —— 这次访问(Tab)内下开关
 * 2. Host 维度 —— 相同域名下统一开关
 * 3. Browser 维度 —— 浏览器下所有启用了插件的页面统一开关
 */
export enum AppletEnabledScope {
  session = 'session',
  host = 'host',
  browser = 'browser',
}

export interface AppletConfig<T = unknown> {
  key: string // unique key
  name: string // display name
  enabled?: boolean // default enable
  hideInControlsCenter?: boolean // hide in controls center
  context?: T extends Record<string, any> ? ContextType<T> : undefined // main values

  // env
  matches: string[] // Like the manifest matches rule, only under configured patterns will activate
  scope?: AppletEnabledScope // used in applet panel to decide the scope of the applet card panel when toggled
  // devtool
  devtools?: boolean // use this applet in dev tool
  hideInDevtools?: boolean | ((url: string) => Promise<boolean> | boolean) // hide this applet in dev tool

  // option page
  alwaysShowOptions?: boolean // show this applet's option page

  // control center
  icon?: string // icon path used in applet card panel and controls center, ext: 'imgs/switch-account-icon.svg',
}
