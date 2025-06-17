import { uniqueId } from 'lodash-es';
import { Subject } from 'rxjs';

import type { Runtime } from 'webextension-polyfill';
import { isEqual } from 'lodash-es';
import { SubscribeBody, ProtocolMap, SendMessageBody, generateStorageKey } from './const';
import { defineExtensionMessaging, ExtensionMessenger } from '@webext-core/messaging';
import { checkEnv } from '@/utils/env';
import { MATCH_URLS } from '@/const/url';
// 遍历查找更新的 key value。Object.fromEntries 消除了重复 key
function _getChangesMap<T extends Record<string, any>>(oldContext: T, newContext: T) {
  const diffNew = Object.keys(oldContext).map((key) => [key, !isEqual(oldContext[key], newContext[key])]);
  const diffOld = Object.keys(newContext).map((key) => [key, !isEqual(oldContext[key], newContext[key])]);
  return Object.fromEntries([...diffNew, ...diffOld]);
}
export class MessageBase<T extends Record<string, any>> {
  stats: T;
  id: string;
  storageKey: string;
  matcheURLs: string[];
  unmountList: (() => void)[] = [];

  queue: Subject<SubscribeBody<T>>;

  messageFunc: ExtensionMessenger<ProtocolMap<T>>;
  storePromise?: Promise<T>;

  constructor(id, stats: T, windowNamespace = 'controller', matcheURLs: string[] | undefined = undefined) {
    console.log('init class', id);
    this.id = id ?? uniqueId('init');
    this.storageKey = generateStorageKey(id || windowNamespace || this.id);
    this.stats = stats;
    this.matcheURLs = matcheURLs ?? MATCH_URLS;
    this.unmountList = [];
    this.queue = new Subject();
    this.messageFunc = defineExtensionMessaging();
  }
  protected responseMessage(event: string, data?: T, sender?: Runtime.MessageSender) {
    // 统一消息结构
    console.log('response message', event, data);
    this.messageFunc.sendMessage(
      event,
      {
        value: data,
        from: {
          id: this.id,
          env: checkEnv(),
        },
      },
      sender?.tab?.id,
    );
  }
  protected spreadMessage(stats?: T, updateTab?: boolean) {
    // bg 广播
  }
  protected onChange(oldStats: T, sender?: Runtime.MessageSender) {
    // bg 广播
    return this.queue.next({
      data: {
        value: this.stats,
        from: {
          id: this.id,
          env: checkEnv(),
        },
      } as SendMessageBody<T>,
      changesMap: _getChangesMap(oldStats, this.stats),
      sender,
    });
  }
  protected initMessage() {
    // bg 初始化缓存，监听同步请求、更新请求
    // 其他模块监听广播、发起同步请求
  }
  protected changeStats(value?: T, sender?: Runtime.MessageSender) {
    const old = this.stats;
    this.stats = value ?? this.stats;
    this.onChange(old, sender);
    return this.stats;
  }
  // 增加 unmount 方法
  public addToUnmountList(unmount: () => void) {
    this.unmountList.push(unmount);
  }
  // unmount 消息
  public unmount() {
    this.queue.unsubscribe();
    this.unmountList.forEach((unmount) => unmount());
  }
  // 订阅消息，返回 unmount 方法
  public subscribe(cb: (body: SubscribeBody<T>) => void, immediate = false) {
    const sub = this.queue.subscribe(cb);
    if (immediate) {
      cb({
        data: {
          value: this.stats,
          from: {
            id: this.id,
            env: checkEnv(),
          },
        } as SendMessageBody<T>,
        changesMap: {},
      });
    }
    return sub.unsubscribe.bind(sub);
  }
  // 修改内容
  public async manualChangeStats(data?: T, sender?: Runtime.MessageSender, updateTab?: boolean) {}
}
