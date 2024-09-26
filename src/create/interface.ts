export type UnMounted = (() => void) | void | Promise<(() => void) | void>
export type HooksUnMounted = () => void
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

export interface AppletConfig<T = unknown, U = unknown> {
  key: string
  scope?: AppletEnabledScope
  name: string
  icon?: string
  enabled?: boolean /** 是不是暂时没用了？ */
  hideInControlsCenter?: boolean
  context?: T extends Record<string, any> ? ContextType<T> : undefined
  // Like the manifest matches rule, only under configured patterns will activate
  matches: string[]

  devtools?: boolean
  hideInDevtools?: boolean | ((url: string) => Promise<boolean> | boolean)

  alwaysShowOptions?: boolean
}
