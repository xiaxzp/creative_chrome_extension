import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';
import type { UnMounted } from './interface';
import { getEventContextKey } from './const';
// import { MATCH_URLS } from '~/const'

declare const self: ServiceWorkerGlobalScope;

export interface WrappedContext<T> {
  key: string
  default: T
}

enum MessageType {
  requestGet = 'request-get-context',
  responseGet = 'response-get-context',
  requestSet = 'request-set-context',
  broadcastChange = 'response-change-context',
}

enum MessageSource {
  background = 'background',
  option = 'option',
  inject = 'inject',
  content = 'content',
  popup = 'popup',
}

type Message<T> = (
  | {
    type: MessageType.requestGet
  }
  | {
    type: MessageType
    data: Partial<T>
  }
) & {
  from: string
  source: MessageSource
  target: MessageSource[]
}

type AutoRunFunc<T> = (context: T) => UnMounted | undefined
type NewContextFunc<T> = (context: T) => Partial<T>
// type AutoRunQueueItem<T> = {
//   func: AutoRunFunc<T>,
//   dependence: (keyof T)[] | null,
// };

export type SetContext<T> = (newContext: NewContextFunc<T> | Partial<T>) => void

export type EmitEvent = (event: string, payload: any) => void
export interface ContextRunParams<T> {
  context: T
  setContext: SetContext<T>
  emitEvent: EmitEvent
}

export type WatchRun<T> = (params: ContextRunParams<T>) => UnMounted | undefined

function isNewContextFunc<T>(context): context is NewContextFunc<T> {
  return typeof context === 'function';
}

export abstract class BaseContext<T> {
  key: string;
  context: T;
  queue: Subject<{
    value: T
    changesMap: Record<string, any>
  }>;

  // autoRunQueue: AutoRunQueueItem<T>[] = [];
  watchUnMounted: ({
    func: AutoRunFunc<T>
    unbind: UnMounted
  })[] = [];

  matches: string[] = [];

  constructor(context: WrappedContext<T>, matches: string[] = []) {
    this.key = context.key;
    this.context = context.default;
    this.queue = new Subject();
    this.watchUnMounted = [];
    this.matches = matches;
  }

  // 遍历查找更新的 key value。Object.fromEntries 消除了重复 key
  private _getChangesMap<T extends Record<string, any>>(oldContext: T, newContext: T) {
    const diffNew = Object.keys(oldContext).map(key => [key, !isEqual(oldContext[key], newContext[key])]);
    const diffOld = Object.keys(newContext).map(key => [key, !isEqual(oldContext[key], newContext[key])]);
    return Object.fromEntries([...diffNew, ...diffOld]);
  }

  protected _getNewContext(newContext: NewContextFunc<T> | Partial<T>, context: T) {
    return isNewContextFunc<T>(newContext) ? newContext(context) : newContext;
  }

  protected _setContext(newContext: NewContextFunc<T> | Partial<T>) {
    console.log('set new context', this.context, this._getNewContext(newContext, this.context));
    const context = {
      ...this.context,
      ...this._getNewContext(newContext, this.context),
    };

    const changesMap = this._getChangesMap(this.context, context as Partial<T>);
    this.context = context;
    this.queue.next({
      value: this.context,
      changesMap,
    });
    return true;
  }

  protected setUnmount(func: AutoRunFunc<T>, unbind: UnMounted) {
    const existTar = this.watchUnMounted.find(item => item.func === func);
    if (existTar) {
      existTar.unbind = unbind;
    }
    else {
      this.watchUnMounted.push({
        func,
        unbind,
      });
    }
  }

  protected unmoundOne(func: AutoRunFunc<T>) {
    const idx = this.watchUnMounted.findIndex(item => item.func === func);
    if (idx > -1) {
      const target = this.watchUnMounted.splice(idx, 1);
      target[0].unbind?.();
    }
  }

  autoRun(func: AutoRunFunc<T>, dependence?: (keyof T)[], immediate?: boolean) {
    let endFunc: (UnMounted) | undefined;
    if (immediate) {
      endFunc = func(this.context);
    }
    const sub = this.queue.subscribe((item) => {
      if (!dependence || dependence.some(dep => (item.changesMap as Partial<T>)[dep])) {
        endFunc?.();
        endFunc = func(this.context);
        this.setUnmount(func, () => {
          endFunc?.();
          sub.unsubscribe();
        });
      }
    });
    const unmount = () => {
      endFunc?.();
      sub.unsubscribe();
    };
    this.setUnmount(func, unmount);
    return () => this.unmoundOne(func);
  }

  setContext: SetContext<T> = async (newContext) => {
    await this._setContext(newContext);
  };

  emitEvent = (event: string, payload: any) => {
    this.setContext({
      [getEventContextKey(event)]: {
        event,
        payload,
      },
    } as unknown as Partial<T>);
  };

  watch(
    run: WatchRun<T>,
    dependence?: (keyof T)[],
    immediate?: boolean,
  ) {
    const unbind = this.autoRun((value) => {
      return run({
        context: value,
        setContext: this.setContext.bind(this),
        emitEvent: this.emitEvent.bind(this),
      });
    }, dependence, immediate);
    return unbind.bind(this);
    // this.watchUnMounted.push(unbind.bind(this));
  }

  on<U>(event: string, run: (payload: U, context: ContextRunParams<T>) => (UnMounted)) {
    const eventContextKey = getEventContextKey(event);
    const onRun = (params: ContextRunParams<T>) => {
      const { context, setContext } = params;
      if (context[eventContextKey]) {
        run(context[eventContextKey].payload, params);
        setContext({
          [eventContextKey]: null,
        } as unknown as Partial<T>);
      }
    };
    return this.watch(onRun, [eventContextKey as keyof T], true);
  }

  removeContext() {
    this.watchUnMounted.forEach(item => item.unbind && item.unbind());
  }
}

/**
 * 主进程
 * background - content 通信使用 chrome.runtime
 * background - popup 通信使用 service worker
 * background - inject 不能直接通信
 */
class BackgroundContext<T> extends BaseContext<T> {
  constructor(context: WrappedContext<T>, matches: string[] = []) {
    super(context, matches);
    chrome.runtime.onMessage.addListener(this._chromeMessageListener);
    self.addEventListener('message', this._serviceWorkerMessageListener);
  }

  private _chromeMessageListener = (request: Message<T>, sender, sendResponse: (v: T) => void) => {
    if (
      request.from !== this.key
      || !request.target.includes(MessageSource.background)
    ) {
      return false;
    }
    if (request.type === MessageType.requestGet) {
      sendResponse(this.context);
      return true;
    }
    if (request.type === MessageType.requestSet) {
      this.setContext(request.data);
      return true;
    }
    return false;
  };

  private _serviceWorkerMessageListener = (event: ExtendableMessageEvent) => {
    const request = event.data;
    if (
      request.from !== this.key
      || !request.target.includes(MessageSource.background)
    ) {
      return;
    }
    const message: Omit<Message<T>, 'type' | 'data'> = {
      from: this.key,
      source: MessageSource.background,
      target: [request.source],
    };
    if (request.type === MessageType.requestGet) {
      event?.source?.postMessage({
        ...message,
        type: MessageType.responseGet,
        data: this.context,
      });
      return;
    }
    if (request.type === MessageType.requestSet) {
      this.setContext(request.data);
    }
  };

  setContext: SetContext<T> = (newContext) => {
    const res = super._setContext(newContext);

    if (!res) {
      return;
    }

    const message: Message<T> = {
      type: MessageType.broadcastChange,
      from: this.key,
      data: this.context,
      source: MessageSource.background,
      target: [],
    };
    chrome.tabs.query({ url: this.matches }, (tabs) => {
      if (!tabs) {
        return;
      }
      tabs.forEach((tab) => {
        console.log('send to tab', tab.id);
        // eslint-disable-next-line ts/no-unused-expressions
        tab.id
        && chrome.tabs.sendMessage(tab.id, {
          ...message,
          target: [MessageSource.content],
        });
      });
    });
    self.clients.matchAll().then((list) => {
      list.forEach((item) => {
        self.clients.get(item.id).then((client) => {
          client?.postMessage({
            ...message,
            target: [MessageSource.popup, MessageSource.option],
          });
        });
      });
    });
  };

  removeContext() {
    chrome.runtime.onMessage.removeListener(this._chromeMessageListener);
    self.removeEventListener('message', this._serviceWorkerMessageListener);
    super.removeContext();
  }
}

/**
 * content - background 通信使用 chrome.runtime
 * content - inject 通信使用 service worker
 */
class ContentContext<T> extends BaseContext<T> {
  constructor(context: WrappedContext<T>, matches: string[] = []) {
    super(context, matches);
    this._initContext();
    chrome.runtime.onMessage.addListener(this._chromeMessageListener);
    addEventListener('message', this._serviceWorkerMessageListener);
  }

  private _initContext() {
    const message: Message<T> = {
      from: this.key,
      type: MessageType.requestGet,
      source: MessageSource.content,
      target: [MessageSource.background],
    };
    chrome.runtime.sendMessage('', message, undefined, (response: T) => {
      super._setContext(response);
      postMessage({
        from: this.key,
        type: MessageType.broadcastChange,
        data: response,
        source: MessageSource.content,
        target: [MessageSource.inject],
      });
    });
  }

  private _chromeMessageListener = (request: Message<T>) => {
    if (
      request.from !== this.key
      || !request.target.includes(MessageSource.content)
    ) {
      return false;
    }
    if (request.type === MessageType.broadcastChange) {
      super._setContext(request.data);
      postMessage({
        ...request,
        source: MessageSource.content,
        target: [MessageSource.inject],
      });
      return true;
    }
    return false;
  };

  private _serviceWorkerMessageListener = (event: MessageEvent<Message<T>>) => {
    const request = event.data;
    if (
      request.from !== this.key
      || request.source === MessageSource.content
      || !request.target.includes(MessageSource.content)
    ) {
      return;
    }
    if (request.type === MessageType.requestGet) {
      const message: Message<T> = {
        from: this.key,
        type: MessageType.responseGet,
        data: this.context,
        source: MessageSource.content,
        target: [MessageSource.inject],
      };
      postMessage(message);
      return;
    }
    if (request.type === MessageType.requestSet) {
      this.setContext(request.data);
    }
  };

  setContext: SetContext<T> = (newContext) => {
    const context = this._getNewContext(newContext, this.context);

    const message: Message<T> = {
      type: MessageType.requestSet,
      from: this.key,
      data: context,
      source: MessageSource.content,
      target: [MessageSource.background],
    };
    chrome.runtime.sendMessage('', message);
  };

  removeContext() {
    chrome.runtime.onMessage.removeListener(this._chromeMessageListener);
    removeEventListener('message', this._serviceWorkerMessageListener);
    super.removeContext();
  }
}

/**
 * inject - content 通信使用 service worker
 * -- get流程 inject -> content -> inject
 * -- set流程 inject -> content -> background
 * ---------set成功后，转化为change  background -> content -> inject
 */
class InjectContext<T> extends BaseContext<T> {
  constructor(context: WrappedContext<T>, matches: string[] = []) {
    super(context, matches);
    this._initContext();
    addEventListener('message', this._serviceWorkerMessageListener);
  }

  private _initContext() {
    const message: Message<T> = {
      from: this.key,
      type: MessageType.requestGet,
      source: MessageSource.inject,
      target: [MessageSource.content],
    };
    postMessage(message);
  }

  private _serviceWorkerMessageListener = (event: MessageEvent<Message<T>>) => {
    const request = event.data;
    if (
      request.from !== this.key
      || request.source === MessageSource.inject
      || !request.target.includes(MessageSource.inject)
    ) {
      return;
    }
    if (MessageType.broadcastChange === request.type) {
      super._setContext(request.data);
      return;
    }
    if (MessageType.responseGet === request.type) {
      super._setContext(request.data);
    }
  };

  setContext: SetContext<T> = (newContext) => {
    const context = this._getNewContext(newContext, this.context);

    const message: Message<T> = {
      type: MessageType.requestSet,
      from: this.key,
      data: context,
      source: MessageSource.inject,
      target: [MessageSource.content],
    };
    postMessage(message);
  };

  removeContext() {
    removeEventListener('message', this._serviceWorkerMessageListener);
    super.removeContext();
  }
}

/**
 * popup - background 通信使用 service worker
 */
class PopupContext<T> extends BaseContext<T> {
  constructor(context: WrappedContext<T>, matches: string[] = []) {
    super(context, matches);
    this._initContext();
    navigator.serviceWorker.addEventListener('message', this._serviceWorkerMessageListener);
  }

  private _initContext() {
    const message: Message<T> = {
      from: this.key,
      type: MessageType.requestGet,
      source: MessageSource.popup,
      target: [MessageSource.background],
    };

    navigator.serviceWorker.ready.then((registration) => {
      registration?.active?.postMessage(message);
    });
  }

  _serviceWorkerMessageListener = (event: MessageEvent<Message<T>>) => {
    const request = event.data;
    if (
      request.from !== this.key
      || request.source === MessageSource.popup
      || !request.target.includes(MessageSource.popup)
    ) {
      return;
    }
    if (MessageType.broadcastChange === request.type) {
      super._setContext(request.data);
      return;
    }
    if (MessageType.responseGet === request.type) {
      super._setContext(request.data);
    }
  };

  setContext: SetContext<T> = (newContext) => {
    const context = this._getNewContext(newContext, this.context);

    const message: Message<T> = {
      type: MessageType.requestSet,
      from: this.key,
      data: context,
      source: MessageSource.popup,
      target: [MessageSource.background],
    };
    navigator.serviceWorker.ready.then((registration) => {
      registration?.active?.postMessage(message);
    });
  };

  removeContext() {
    navigator.serviceWorker.removeEventListener('message', this._serviceWorkerMessageListener);
    super.removeContext();
  }
}

/**
 * option - background 通信使用 service worker
 */
class OptionContext<T> extends BaseContext<T> {
  constructor(context: WrappedContext<T>, matches: string[] = []) {
    super(context, matches);
    this._initContext();
    navigator.serviceWorker.addEventListener('message', this._serviceWorkerMessageListener);
  }

  private _initContext() {
    const message: Message<T> = {
      from: this.key,
      type: MessageType.requestGet,
      source: MessageSource.option,
      target: [MessageSource.background],
    };

    navigator.serviceWorker.ready.then((registration) => {
      registration?.active?.postMessage(message);
    });
  }

  private _serviceWorkerMessageListener = (event: MessageEvent<Message<T>>) => {
    const request = event.data;
    if (
      request.from !== this.key
      || request.source === MessageSource.option
      || !request.target.includes(MessageSource.option)
    ) {
      return;
    }
    if (MessageType.broadcastChange === request.type) {
      super._setContext(request.data);
      return;
    }
    if (MessageType.responseGet === request.type) {
      super._setContext(request.data);
    }
  };

  setContext: SetContext<T> = (newContext) => {
    const context = this._getNewContext(newContext, this.context);

    const message: Message<T> = {
      type: MessageType.requestSet,
      from: this.key,
      data: context,
      source: MessageSource.option,
      target: [MessageSource.background],
    };
    navigator.serviceWorker.ready.then((registration) => {
      registration?.active?.postMessage(message);
    });
  };

  removeContext() {
    navigator.serviceWorker.removeEventListener('message', this._serviceWorkerMessageListener);
    super.removeContext();
  }
}

export function createContentContext<T>(context: WrappedContext<T>, matches: string[]) {
  return new ContentContext<T>(context, matches);
}

export function createBackgroundContext<T>(context: WrappedContext<T>, matches: string[]) {
  return new BackgroundContext<T>(context, matches);
}

export function createInjectContext<T>(context: WrappedContext<T>, matches: string[]) {
  return new InjectContext<T>(context, matches);
}

export function createPopupContext<T>(context: WrappedContext<T>, matches: string[]) {
  return new PopupContext<T>(context, matches);
}

export function createOptionContext<T>(context: WrappedContext<T>, matches: string[]) {
  return new OptionContext<T>(context, matches);
}

export function createContext<T>(context: WrappedContext<T>, matches: string[] = []) {
  try {
    const { location } = window;
    if (
      location.protocol === 'chrome-extension:'
      && location.pathname.startsWith('/popup')
    ) {
      return createPopupContext(context, matches);
    }
    if (
      location.protocol === 'chrome-extension:'
      && location.pathname.startsWith('/option')
    ) {
      return createOptionContext(context, matches);
    }
    if (chrome.extension) {
      return createContentContext(context, matches);
    }
    return createInjectContext(context, matches);
  }
  catch {
    return createBackgroundContext(context, matches);
  }
}
