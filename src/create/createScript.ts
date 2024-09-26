import {
  type BaseContext,
  createContext,
} from './createContext';

import type { AppletConfig, UnMounted } from './interface';
import {
  convertConfigContext,
  getContextFormStorage,
  setStorageFromContext,
} from './create';
// import { getEventContextKey } from './const';
import { contextStorage } from './context';

export type Run = (config: AppletConfig) => UnMounted

export enum CreateType {
  background = 'background',
  content = 'content',
  inject = 'inject',
  data = 'data',
}

export function create(type: CreateType) {
  return <T = any>(run: (context?: BaseContext<T>) => UnMounted) => {
    return async (config: AppletConfig<T>) => {
      if (!config.context) {
        return run();
      }

      const context = createContext<T>({
        key: config.key,
        default: convertConfigContext(config.context!),
      }, config.matches ?? []);

      contextStorage.setContext(context);

      if (type === CreateType.background) {
        console.log('run get store', config.key, config.context!);

        context.autoRun((value: any) => {
          console.log('auto set', config.key, config.context!, value);
          setStorageFromContext(config.key, config.context!, value);
        });

        await getContextFormStorage(config.key, config.context!, (value) => {
          context.setContext(value);
        });
      }

      // const emitEvent = (event: string, payload: any) => {
      //   context.setContext({
      //     [getEventContextKey(event)]: {
      //       event,
      //       payload,
      //     },
      //   } as unknown as Partial<T>);
      // };

      // const startIdx = watchQueueIdx;
      const unMounted = run(context);
      // const endIdx = watchQueueIdx;
      // const queue = watchQueue.popQueue() as WatchQueueItem<T>[];
      // const watchUnMounted: (HooksUnMounted | void)[] = [];

      // queue.forEach(item => {

      //   const unbind = context.autoRun((value) => {
      //     return item.run({
      //       context: value,
      //       setContext: context.setContext,
      //       emitEvent,
      //     });
      //   }, item.dependence, item.immediate);
      //   watchUnMounted.push(unbind.bind(context));
      // });

      return async () => {
        (await unMounted)?.();
        // watchUnMounted.forEach(item => item && item());
        contextStorage.removeContext(context.key);
        context.removeContext();
      };
    };
  };
}

export const createBackground = create(CreateType.background);
export const createInject = create(CreateType.inject);
export const createContent = create(CreateType.content);
export const createData = create(CreateType.data);
