<template>
  <main class="flex font-sans">
    <div class="p-16px w-250px h-100vh flex-shrink-0 sticky top-0">
      <div class="flex items-center">
        <img
          class="w-48px h-48px"
          :src="getExtensionAssetPath('imgs/logo.png')"
        >
        <div class="ml-16px text-xl font-semibold">
          Creative Extension
        </div>
      </div>
      <div class="pt-16px">
        <div v-for="item in routes" :key="item.key" class="border-b mt-16px">
          <div class="text-gray-400 font-bold mb-8px">
            {{ item.name }}
          </div>
          <div
            v-for="route in item.routers"
            :key="route.key"
            class="text-base pl-16px py-8px rounded-4px text-default cursor-pointer hover:bg-light-400"
            :class="{
              'bg-[#121212]': route.key === currentRouteKey,
              '!hover:bg-[#121212]': route.key === currentRouteKey,
              'text-white': route.key === currentRouteKey,
            }"
            @click="() => clickTab(route)"
          >
            {{ route.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 pl-16px flex min-w-0">
      <div v-if="currentRoute" class="flex-1 flex flex-col min-w-0">
        <div
          class="text-2xl py-16px border-b leading-48px font-bold sticky top-0 bg-white z-10"
        >
          {{ currentRoute.name }}
        </div>
        <component
          :is="currentRoute.component"
          v-if="contextMap[currentRouteKey]"
          class="flex-1"
          :context="contextMap[currentRouteKey].value"
          @set-context="contextMap[currentRouteKey].set"
          @emit-event="contextMap[currentRouteKey].emit"
        />
        <component :is="currentRoute.component" v-else />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Settings from './Settings.vue';
import useInitExtension from '~/hooks/initExtension';
import { getExtensionAssetPath } from '~/utils/browser';
import { dealModules } from '~/create/create';
import ALL_APPLET_CONFIGS from '~/create/configs';

const { contextMap } = useInitExtension();

const context = require.context('../applets', true, /Options\.vue$/);

const modules = context.keys().reduce((acc, key) => {
  acc[key] = context(key);
  return acc;
}, {});

const componentsMap = dealModules(
  modules,
);

const extensionRoutes = computed(() =>
  ALL_APPLET_CONFIGS.filter(
    item => componentsMap[item.key] && (item.alwaysShowOptions),
  ).map(item => ({
    key: item.key,
    component: componentsMap[item.key],
    name: item.name,
  })),
);

const dashboardRoutes = [
  {
    key: 'settings',
    name: 'Settings',
    component: Settings,
  },
];

const routes = computed(() => [
  {
    key: 'dashboard',
    name: 'Dashboard',
    routers: dashboardRoutes,
  },
  {
    key: 'extension',
    name: 'Extension List',
    routers: extensionRoutes.value,
  },
]);

const currentRouteKey = ref(extensionRoutes.value[0].key);
const currentRoute = computed(() =>
  extensionRoutes.value
    .concat(dashboardRoutes)
    .find(item => item.key === currentRouteKey.value),
);

function clickTab(item) {
  currentRouteKey.value = item.key;
}
</script>
