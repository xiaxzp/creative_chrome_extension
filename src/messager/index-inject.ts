import { checkEnv } from '../utils/env';
import { Env } from '@/types/env';
import { InitMessagerProps } from './const';
import MessageCallerInject from './injected';
import MessageCenterContent from './content-inject';

export function initMessager<T extends Record<string, any>>(props: InitMessagerProps<T>) {
  // 初始化配置
  const { id, stats, namespace, shouldStore } = props;
  switch (checkEnv()) {
    case Env.injected:
      if (!namespace) {
        throw new Error('namespace is required in inject');
      }
      return new MessageCallerInject(id, stats, namespace);
      break;

    case Env.content:
      if (!namespace) {
        throw new Error('namespace is required in content');
      }
      return new MessageCenterContent(id, stats, namespace, shouldStore);
      break;
    default:
      throw new Error('extension script should import from index');
      break;
  }
}
