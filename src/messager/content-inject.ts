import { MessageBaseInject } from './base-inject';
import { generateEvent, MessageType } from './const';
import { checkEnv } from '@/utils/env';

// 仅 content-inject 消息中心，不与插件内核传递消息，可以直接对接 inject 层
export default class MessageCenterContent<T extends Record<string, any>> extends MessageBaseInject<T> {
  shouldStore = false;
  storePromise: Promise<T>;
  constructor(id: string, stats: T, windowNamespace?: string, shouldStore: boolean = false) {
    super(id, stats, windowNamespace);
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
  }
  protected spreadMessage(stats?: T) {
    // 消息广播
    console.log('broadcast from content', generateEvent(this.id, MessageType.MessageBroadcast));
    this.sendMessage(generateEvent(this.id, MessageType.MessageBroadcast), stats);
  }
  protected initMessage() {
    // 初始化
    // 接收新模块的同步请求
    const unmount1 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.SyncMessageRequest), (resp) => {
      this.responseMessage(generateEvent(this.id, MessageType.SyncMessageResponse), this.stats);
    });
    const unmount2 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.UpdateMessageRequest), (resp) => {
      this.manualChangeStats(resp.data?.value);
    });

    this.unmountList.push(unmount1, unmount2);
  }
  public async manualChangeStats(data?: T) {
    const newStats = super.changeStats(data);
    await this.storePromise;
    await this.writeCacheToStorage(newStats);
    await this.spreadMessage(newStats);
  }
}
