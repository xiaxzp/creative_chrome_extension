import { reactive, ref } from 'vue';
import ALL_APPLET_CONFIGS, { configObj } from '~/create/configs';
import { createData } from '~/create/createScript';
import { initExtension } from '~/create/create';
import { getEventContextKey } from '~/create/const';
import { contextStorage } from '~/create/context';
import type { UnMounted } from '~/create/interface';

// 把 context 挂载到 vue 响应式
export default function useInitExtension() {
  const contextMap = reactive(ALL_APPLET_CONFIGS.reduce((res, item) => {
    res[item.key] = { value: null, set: () => {} };
    return res;
  }, {}));
  const { unbind, context } = initExtension((key) => {
    let unmount: UnMounted | undefined;
    if (!contextStorage.getContext(key)) {
      unmount = createData(() => {})(configObj[key]);
    }
    const context = contextStorage.getContext(key);
    if (context) {
      contextMap[key] = {
        value: context.context,
        set: context.setContext.bind(context),
        emit: (event: string, payload: any) => {
          context.setContext({
            [getEventContextKey(event)]: {
              event,
              payload,
            },
          });
        },
      };
      const unbind = context.watch(({ context: v }) => {
        contextMap[key].value = v;
      }, undefined, false);
      return unmount || unbind.bind(context);
    }
  });

  const extensionsAvailable = ref(context.context);

  context.autoRun((value) => {
    extensionsAvailable.value = value;
  });

  onBeforeUnmount(() => {
    unbind();
  });

  return { extensionsAvailable, contextMap };
}
