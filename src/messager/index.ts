import { checkEnv } from '../utils/env';
import { Env } from '@/types/env';
import MessageCenterBG from './background';
import MessageCallerWeb from './web';
import MessageCallerContent from './content';
import { InitMessagerProps } from './const';

export function initMessager<T extends Record<string, any>>(props: InitMessagerProps<T>) {
  // 初始化配置
  const { id, stats, shouldStore = false, namespace, matcheURLs } = props;
  switch (checkEnv()) {
    case Env.background:
      // bg 初始化
      return new MessageCenterBG(id, stats, namespace, shouldStore, matcheURLs);
      break;
    case Env.content:
      if (!namespace) {
        throw new Error('namespace is required in content');
      }
      return new MessageCallerContent(id, stats, namespace);
      break;
    case Env.injected:
      throw new Error('inject script should import from index-inject');
      break;
    default:
      return new MessageCallerWeb(id, stats, namespace);
      break;
  }
}
