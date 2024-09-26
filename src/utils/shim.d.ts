import { ProtocolWithReturn } from 'webext-bridge';

import type { TabBackgroundMessageType } from './message';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    [TabBackgroundMessageType]: {
      key: string
      content: any
    }
  }
}
