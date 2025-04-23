import { MessageBase } from './base';
import { generateEvent, MessageType, SendMessageBody } from './const';
import { checkEnv } from '@/utils/env';
export default class MessageCallerWeb<T extends Record<string, any>> extends MessageBase<T> {
  constructor(id: string, stats: T, namespace?: string) {
    super(id, stats, namespace);
    this.initMessage();
  }
  protected initMessage() {
    // 初始化
    // 接收新模块的同步请求
    const unmount1 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.MessageBroadcast), (resp) => {
      super.changeStats(resp.data?.value ?? this.stats, resp.sender);
    });
    const unmount2 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.SyncMessageResponse), (resp) => {
      super.changeStats(resp.data?.value ?? this.stats, resp.sender);
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
    console.log('change from popup');
    await this.messageFunc.sendMessage(generateEvent(this.id, MessageType.UpdateMessageRequest), {
      from: {
        id: this.id,
        env: checkEnv(),
      },
      value: data,
    });
  }
}
