import { Env } from '@/types/env';
import type { Runtime } from 'webextension-polyfill';

export interface InitMessagerProps<T> {
  id: string;
  stats: T;
  shouldStore?: boolean;
  namespace?: string;
  matcheURLs?: string[];
}

export interface SendMessageBody<T extends Record<string, any>> {
  value?: T;
  from?: {
    id: string;
    env: Env;
  };
}

export interface SubscribeBody<T extends Record<string, any>> {
  data: SendMessageBody<T>;
  changesMap: Record<string, boolean>;
  sender?: Runtime.MessageSender;
}

export enum MessageType {
  SyncMessageRequest = 'SyncMessageRequest',
  SyncMessageResponse = 'SyncMessageResponse',
  UpdateMessageRequest = 'UpdateMessageRequest',
  MessageBroadcast = 'MessageBroadcast',
}
export type ProtocolMap<T extends Record<string, any>> = Record<string, (arg?: SendMessageBody<T>) => number>;

export function generateEvent(id: string, event: MessageType) {
  return `${event}-${id}`;
}

export function generateStorageKey(id: string) {
  return `creative_x_extension_${id}`;
}
