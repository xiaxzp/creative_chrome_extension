import { MessageBase } from './base';
import { generateEvent, MessageType } from './const';
import { checkEnv } from '@/utils/env';
import type { Runtime } from 'webextension-polyfill';
export default class MessageCenterBackground<T extends Record<string, any>> extends MessageBase<T> {
  shouldStore = false;
  storePromise: Promise<T>;
  constructor(
    id: string,
    stats: T,
    windowNamespace?: string,
    shouldStore: boolean = false,
    matcheURLs: string[] | undefined = undefined,
  ) {
    super(id, stats, windowNamespace, matcheURLs);
    this.shouldStore = shouldStore;
    this.initMessage();
    this.storePromise = this.readCacheFromStorage();
  }
  protected async readCacheFromStorage(): Promise<T> {
    if (this.shouldStore) {
      // 从 storage 中读取缓存
      const storeItem = await storage.getItem<T>(`local:${this.storageKey}`);
      return this.changeStats(Object.assign({}, this.stats, storeItem ?? {}));
    } else {
      return this.stats;
    }
  }
  protected async writeCacheToStorage(stats: T) {
    if (this.shouldStore) {
      // 存储到 storage 中
      await storage.setItem<T>(`local:${this.storageKey}`, stats);
    }
  }
  protected sendMessage(event: string, stats?: T) {
    this.messageFunc.sendMessage(event, {
      value: stats || this.stats,
      from: {
        id: this.id,
        env: checkEnv(),
      },
    });
    chrome.tabs.query({ url: this.matcheURLs }, (tabs) => {
      if (!tabs) {
        return;
      }
      tabs.forEach((tab) => {
        if (tab.id) {
          this.messageFunc.sendMessage(
            event,
            {
              value: stats || this.stats,
              from: {
                id: this.id,
                env: checkEnv(),
              },
            },
            tab.id,
          );
        }
      });
    });
  }
  protected spreadMessage(stats?: T) {
    // 消息广播
    console.log('broadcast from bg', generateEvent(this.id, MessageType.MessageBroadcast));
    this.sendMessage(generateEvent(this.id, MessageType.MessageBroadcast), stats);
  }
  protected initMessage() {
    // 初始化
    // 接收新模块的同步请求
    const unmount1 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.SyncMessageRequest), (resp) => {
      this.responseMessage(generateEvent(this.id, MessageType.SyncMessageResponse), this.stats, resp.sender);
    });
    const unmount2 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.UpdateMessageRequest), (resp) => {
      this.manualChangeStats(resp.data?.value, resp.sender);
    });

    this.unmountList.push(unmount1, unmount2);
  }
  public async manualChangeStats(data?: T, sender?: Runtime.MessageSender) {
    const newStats = super.changeStats(data, sender);
    await this.storePromise;
    await this.writeCacheToStorage(newStats);
    await this.spreadMessage(newStats);
  }
}
