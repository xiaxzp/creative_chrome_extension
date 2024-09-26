<template>
  <main>
    <GlassCard
      v-for="item in availableComponents"
      v-show="!controlStore.hideAllApplets"
      :key="item.key"
      draggable
      shrinkable
      with-window-control
      :title="item.name"
      :icon="item.icon"
      :record-key="`[TcmDevtool]${item.key}`"
      @shutdown="onAppletShutdown(item)"
    >
      <template #default="slotProps">
        <component
          :is="item.component"
          :context="contextMap[item.key].value"
          :content="contentMap[item.key]?.value"
          :shrinked="slotProps.shrinked"
          @set-context="contextMap[item.key].set"
          @set-content="contentMap[item.key]?.set ?? (() => {})"
          @emit-event="contextMap[item.key].emit"
        />
      </template>
    </GlassCard>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onKeyDown } from '@vueuse/core';
import { snakeCase } from 'lodash-es';
import { getPopperPortal } from '../utils';
import { controlStore } from '../shared';
import useInitExtension from '~/hooks/initExtension';
import { useInitContent } from '~/hooks/content';
import { dealModules } from '~/create/create';
import {
  useAppletEnabled,
  useAvailableAppletList,
} from '~/hooks/appletEnablings';
import type { AppletConfig } from '~/create/interface';
import { useTracker } from '~/hooks/tracker';

const { trackEvent } = useTracker();

const { contextMap } = useInitExtension();

const contentMap = useInitContent();

const appletList = useAvailableAppletList();

function onAppletShutdown(conf: AppletConfig) {
  const [, toggle] = useAppletEnabled(conf);
  toggle(false);
}

const context = require.context('../../applets', true, /Content\.vue$/);

const modules = context.keys().reduce((acc, key) => {
  acc[key] = context(key);
  return acc;
}, {});

const componentsMap = dealModules(
  modules,
);
console.log('=>(AppletList.vue:68) componentsMap', componentsMap);

const availableComponents = computed(() => {
  return appletList.value
    .filter((item) => {
      const [enabled] = useAppletEnabled(item);
      return enabled.value && componentsMap[item.key];
    })
    .map(item => ({
      ...item,
      component: componentsMap[item.key],
      name: item.name,
    }));
});

watch(availableComponents, (newList, oldList) => {
  for (const item of newList) {
    if (!oldList?.some(oldItem => oldItem.key === item.key)) {
      trackEvent(`content_show_applet_${snakeCase(item.key)}`);
    }
  }
});

const popperPortal = getPopperPortal();
const isMac = navigator.platform.toLowerCase().startsWith('mac');

// shortcut to toggle visibility, Shift + CMD + H for MacOS, Shift + Ctrl + H for others
onKeyDown(['q', 'Q'], (e) => {
  if (
    (isMac && e.shiftKey && e.ctrlKey)
    || (!isMac && e.shiftKey && e.ctrlKey)
  ) {
    e.preventDefault();
    controlStore.hideAllApplets = !controlStore.hideAllApplets;
    popperPortal.style.display = !controlStore.hideAllApplets
      ? 'block'
      : 'none';
  }
});
</script>
