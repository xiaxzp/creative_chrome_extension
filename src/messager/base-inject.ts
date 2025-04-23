import { uniqueId } from 'lodash-es';
import { Subject } from 'rxjs';

import type { Runtime } from 'webextension-polyfill';
import { isEqual } from 'lodash-es';
import { SubscribeBody, ProtocolMap, SendMessageBody, generateStorageKey } from './const';
import { defineWindowMessaging, WindowMessenger } from '@webext-core/messaging/page';
import { checkEnv } from '@/utils/env';
// 遍历查找更新的 key value。Object.fromEntries 消除了重复 key
function _getChangesMap<T extends Record<string, any>>(oldContext: T, newContext: T) {
  const diffNew = Object.keys(oldContext).map((key) => [key, !isEqual(oldContext[key], newContext[key])]);
  const diffOld = Object.keys(newContext).map((key) => [key, !isEqual(oldContext[key], newContext[key])]);
  return Object.fromEntries([...diffNew, ...diffOld]);
}
export class MessageBaseInject<T extends Record<string, any>> {
  stats: T;
  id: string;
  storageKey: string;
  unmountList: (() => void)[] = [];

  queue: Subject<SubscribeBody<T>>;

  messageFunc: WindowMessenger<ProtocolMap<T>>;
  storePromise?: Promise<T>;

  constructor(id, stats: T, windowNamespace = 'controller') {
    console.log('init class', id);
    this.id = id ?? uniqueId('init');
    this.storageKey = generateStorageKey(id || windowNamespace || this.id);
    this.stats = stats;
    this.unmountList = [];
    this.queue = new Subject();
    this.messageFunc = defineWindowMessaging({
      namespace: windowNamespace,
    });
  }
  protected responseMessage(event: string, data?: T) {
    // 统一消息结构
    console.log('response message', event, data);
    this.messageFunc.sendMessage(event, {
      value: data,
      from: {
        id: this.id,
        env: checkEnv(),
      },
    });
  }
  protected spreadMessage(stats?: T) {
    // bg 广播
  }
  protected onChange(oldStats: T) {
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
    });
  }
  protected initMessage() {
    // bg 初始化缓存，监听同步请求、更新请求
    // 其他模块监听广播、发起同步请求
  }
  protected changeStats(value?: T) {
    const old = this.stats;
    this.stats = value ?? this.stats;
    this.onChange(old);
    return this.stats;
  }
  public addToUnmountList(unmount: () => void) {
    this.unmountList.push(unmount);
  }
  public unmount() {
    this.queue.unsubscribe();
    this.unmountList.forEach((unmount) => unmount());
  }
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
  public async manualChangeStats(data?: T) {}
}
