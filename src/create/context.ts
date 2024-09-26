import type { BaseContext } from './createContext';
import { ExtensionAvailableKey, AppletsEnablingContext } from './configs';
export class ContextStorage {
  contextMap: Record<string, BaseContext<unknown>> = {};
  constructor() {
    this.contextMap = {};
  }

  getContext<T extends any>(key: string) {
    const target = this.contextMap[key];
    // if (!target) {
    //   console.error('Maybe you forget to init this context?');
    // }
    return target as BaseContext<T>;
  }

  getAppletsEnablingContext() {
    return this.getContext<typeof AppletsEnablingContext['default']>(ExtensionAvailableKey);
  }


  setContext(context: BaseContext<unknown>) {
    this.contextMap[context.key] = context;
  }

  removeContext(key: string) {
    delete this.contextMap[key];
  }
}
export const contextStorage = new ContextStorage();
export default contextStorage;