/// <reference types="vue/macros-global" />

declare const __DEV__: boolean;

interface CSSType {
  [key in CSSStyleDeclaration]?: unknown
}
declare module '*.vue' {
  const component: any;
  export default component;
}

declare module 'vite-plugin-copy';

declare module '*.svelte' {
  export { SvelteComponentDev as default } from 'svelte/internal';
}

interface TCMInstance {
  injectedDiv?: HTMLDivElement
}
declare interface Window {
  switchstatus: number
  __TCM_INSTANCE__: TCMInstance
}
declare let _tcm: TCMType;
declare let MyNamespace: any;
declare let Vue: any;
declare let $: any;
