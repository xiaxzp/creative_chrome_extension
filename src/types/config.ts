import type { ContentScriptContext } from '#imports';
export interface Config {
  defaultOn: boolean; // 默认开启
  name?: string; // 名字
  matches?: string[]; // 匹配的url
  showInCenter?: boolean; // 展示在控制中心
}
export type unmountFunction = () => void;
export type scriptFunction = (ctx?: ContentScriptContext) => unmountFunction | void | undefined;
export type jsxFunction = () => JSX.Element;
