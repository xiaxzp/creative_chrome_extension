import { MessageBaseInject } from './base-inject';
import { generateEvent, MessageType } from './const';
import { checkEnv } from '@/utils/env';
export default class MessageCallerInject<T extends Record<string, any>> extends MessageBaseInject<T> {
  constructor(id: string, stats: T, windowNamespace: string) {
    super(id, stats, windowNamespace);
    this.initMessage();
  }
  protected initMessage() {
    // 初始化
    // 接收新模块的同步请求
    const unmount1 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.MessageBroadcast), (resp) => {
      console.log('receive broadcast', generateEvent(this.id, MessageType.MessageBroadcast));
      super.changeStats(resp.data?.value ?? this.stats);
    });
    const unmount2 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.SyncMessageResponse), (resp) => {
      super.changeStats(resp.data?.value ?? this.stats);
    });
    this.unmountList.push(unmount1, unmount2);

    console.log('init from popup');
    this.messageFunc.sendMessage(generateEvent(this.id, MessageType.SyncMessageRequest), {
      from: {
        id: this.id,
        env: checkEnv(),
      },
    });
  }
  public async manualChangeStats(data: T) {
    console.log('change from inject');
    const newStats = super.changeStats(data);
    await this.messageFunc.sendMessage(generateEvent(this.id, MessageType.UpdateMessageRequest), {
      from: {
        id: this.id,
        env: checkEnv(),
      },
      value: newStats,
    });
  }
}
