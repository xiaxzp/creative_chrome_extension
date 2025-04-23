import { MessageBase } from './base';
import { generateEvent, MessageType, ProtocolMap } from './const';
import { checkEnv } from '@/utils/env';
import { defineWindowMessaging, WindowMessenger } from '@webext-core/messaging/page';
export default class MessageCallerContent<T extends Record<string, any>> extends MessageBase<T> {
  injectMessageFunc: WindowMessenger<ProtocolMap<T>>;

  constructor(id: string, stats: T, windowNamespace: string) {
    super(id, stats, windowNamespace);
    this.injectMessageFunc = defineWindowMessaging({
      namespace: windowNamespace,
    });
    this.initMessage();
  }
  protected initMessage() {
    // 初始化
    // 接收新模块的同步请求
    const unmount1 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.MessageBroadcast), (resp) => {
      console.log('receive broadcast', generateEvent(this.id, MessageType.MessageBroadcast));
      this.injectMessageFunc.sendMessage(generateEvent(this.id, MessageType.MessageBroadcast), resp.data);
      super.changeStats(resp.data?.value ?? this.stats, resp.sender);
    });
    const unmount2 = this.messageFunc.onMessage(generateEvent(this.id, MessageType.SyncMessageResponse), (resp) => {
      this.injectMessageFunc.sendMessage(generateEvent(this.id, MessageType.SyncMessageResponse), resp.data);
      super.changeStats(resp.data?.value ?? this.stats, resp.sender);
    });

    const unmount3 = this.injectMessageFunc.onMessage(
      generateEvent(this.id, MessageType.SyncMessageRequest),
      (resp) => {
        this.messageFunc.sendMessage(generateEvent(this.id, MessageType.SyncMessageRequest), resp.data);
      },
    );

    const unmount4 = this.injectMessageFunc.onMessage(
      generateEvent(this.id, MessageType.UpdateMessageRequest),
      (resp) => {
        this.messageFunc.sendMessage(generateEvent(this.id, MessageType.UpdateMessageRequest), resp.data);
      },
    );
    this.unmountList.push(unmount1, unmount2, unmount3, unmount4);

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
