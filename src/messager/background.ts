// oxlint-disable max-nested-callbacks
import { MessageBase } from './base';
import { generateEvent, MessageType } from './const';
import { checkEnv } from '@/utils/env';
import type { Runtime } from 'webextension-polyfill';
const BuildTime = Date.now();

export default class MessageCenterBackground<T extends Record<string, any>> extends MessageBase<T> {
  private updatedTabIds: Map<number, number>;
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
    this.updatedTabIds = new Map();
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
  protected sendMessage(event: string, stats?: T, updateTab?: boolean) {
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
      chrome.tabs.query({ active: true, currentWindow: true }, (currentTabs) => {
        tabs.forEach((tab) => {
          const lastAccessed = this.updatedTabIds.get(tab.id?? -1) || tab.lastAccessed;

          if (tab.id && lastAccessed > BuildTime) {
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
            ).then(() => {
              if (!this.updatedTabIds.has(tab.id ?? -1)) {
                this.updatedTabIds.set(tab.id ?? -1, Date.now());
              }
            }).catch(e => {
              if (updateTab && !this.updatedTabIds.has(tab.id ?? -1)) {
                this.updatedTabIds.set(tab.id ?? -1, Date.now());
                chrome.tabs.reload(tab.id);
              }
              console.error('---debug--- send tab message error', e, tab, BuildTime)
            });;
          } else if (tab.id && (currentTabs?.[0]?.id === tab.id || updateTab) && !this.updatedTabIds.has(tab.id ?? -1)) {
            // console.log('---debug--- reload tab', JSON.stringify(tab))
            this.updatedTabIds.set(tab.id ?? -1, Date.now());
            chrome.tabs.reload(tab.id);
          }
        });
      })

    });
  }
  protected spreadMessage(stats?: T, updateTab?: boolean) {
    // 消息广播
    console.log('broadcast from bg', generateEvent(this.id, MessageType.MessageBroadcast));
    this.sendMessage(generateEvent(this.id, MessageType.MessageBroadcast), stats, updateTab);
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
  public async manualChangeStats(data?: T, sender?: Runtime.MessageSender, updateTab?: boolean) {
    const newStats = super.changeStats(data, sender);
    await this.storePromise;
    await this.writeCacheToStorage(newStats);
    await this.spreadMessage(newStats, updateTab);
  }
}
