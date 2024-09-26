import type { Ref } from 'vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import type { RemovableRef } from '@vueuse/core';
import { StorageSerializers } from '@vueuse/core';
import { isNil } from 'lodash-es';
import EventEmitter from 'eventemitter3';
import ALL_APPLET_CONFIGS, { filterConfigsByMatches } from '~/create/configs';
import type { AppletConfig } from '~/create/interface';
import { AppletEnabledScope } from '~/create/interface';
import { contextStorage } from '~/create/context';

const EE = new EventEmitter();

export function useAppletEnabled(conf: AppletConfig): [Ref<boolean> | RemovableRef<boolean>, any] {
  const { scope = AppletEnabledScope.browser, key: appletKey } = conf;
  const appletsEnablingBrowserContext = contextStorage.getAppletsEnablingContext();
  if (!appletsEnablingBrowserContext) {
    console.error('unexpected no context');
  }
  const isBrowserLevelScope = scope === AppletEnabledScope.browser || isNil(scope);

  // Browser 维度的值存储在 service worker 里
  if (isBrowserLevelScope) {
    // const state = toRefs(reactive(appletsEnablingBrowserContext.context[conf.key]));
    const state = ref(appletsEnablingBrowserContext.context[conf.key].enabled);

    const toggle = (val?: boolean) => {
      appletsEnablingBrowserContext.setContext((context) => {
        const enabled = val ?? !context[appletKey]?.enabled;

        return {
          ...context,
          [appletKey]: {
            ...context[appletKey],
            enabled,
          },
        };
      });
    };

    const unbind = appletsEnablingBrowserContext.autoRun((context) => {
      state.value = context[conf.key].enabled;
    });

    onBeforeUnmount(() => {
      unbind();
    });

    return [state, toggle];
  }

  const STORAGE_KEY = `[CTFEDevtool]${appletKey}_enabled`;
  const storage = {
    [AppletEnabledScope.session]: sessionStorage,
    [AppletEnabledScope.host]: localStorage,
  }[scope] ?? localStorage;

  // @Note: 不要直接修改这个 ref，只是用来映射 storage 里的值的。为了实现同页面修改 storage 值并且响应式而 hack
  const state = ref(
    StorageSerializers.boolean.read(storage.getItem(STORAGE_KEY) as string),
  );
  watch(state, (val) => {
    storage.setItem(STORAGE_KEY, StorageSerializers.boolean.write(val));
  });

  const EE_EVENT_NAME = `${STORAGE_KEY}_change`;

  EE.on(EE_EVENT_NAME, handleStoredValChange);

  if (storage === localStorage) {
    window.addEventListener('storage', (event) => {
      if (event?.key === STORAGE_KEY) {
        handleStoredValChange(StorageSerializers.boolean.read(event.newValue as string));
      }
    });
  }

  onBeforeUnmount(() => {
    EE.removeListener(EE_EVENT_NAME, handleStoredValChange);
  });

  return [state, toggle];

  async function handleStoredValChange(nextVal) {
    await nextTick();

    state.value = nextVal;
  }

  function toggle(val?: boolean) {
    const nextVal = val ?? !state.value;
    EE.emit(`${STORAGE_KEY}_change`, nextVal);
  }
}

export function useAvailableAppletList() {
  return computed(() => {
    return ALL_APPLET_CONFIGS.filter(filterConfigsByMatches);
  });
}
