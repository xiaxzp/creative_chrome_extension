<template>
  <main class="creative-fe-devtools h-screen">
    <ElTabs v-model="activeComponentKey" type="border-card">
      <ElTabPane
        v-for="item in availableComponents"
        :key="item.key"
        :label="item.name"
        :name="item.key"
      >
        <component :is="item.component" />

        <template #label>
          <div class="flex items-center justify-center">
            <img
              class="w-[16px] h-[16px] mr-[6px]"
              :src="getExtensionAssetPath(item.icon)"
            >
            <div>{{ item.name }}</div>
          </div>
        </template>
      </ElTabPane>
    </ElTabs>
  </main>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { snakeCase } from 'lodash-es';
import { dealModules } from '~/create/create';
import ALL_APPLET_CONFIGS from '~/create/configs';
import { getExtensionAssetPath } from '~/utils/browser';
import { useTracker } from '~/hooks/tracker';

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
});

const { trackPageview, trackEvent } = useTracker();

onMounted(() => {
  trackPageview();
  trackEvent('devtools_show_page');
});

const context = require.context('../../applets', true, /Devtools\.vue$/);

const modules = context.keys().reduce((acc, key) => {
  acc[key] = context(key);
  return acc;
}, {});

const componentsMap = dealModules(
  modules,
);

let availableComponents = $ref<any>([]);
let activeComponentKey = $ref('');

watch(
  () => activeComponentKey,
  (key) => {
    const target = availableComponents.find(comp => comp.key === key);
    if (target) {
      trackEvent(`devtools_show_applet_${snakeCase(target.key)}`);
    }
  },
  {
    immediate: true,
  },
);

async function filterComponents() {
  const components: any[] = [];

  await Promise.all(
    ALL_APPLET_CONFIGS.filter(item => item.devtools && componentsMap[item.key])
      .map(async (config) => {
        let hide: boolean;
        if (typeof config.hideInDevtools === 'function') {
          hide = await config.hideInDevtools(props.href);
        }
        else {
          hide = config.hideInDevtools ?? false;
        }
        if (!hide) {
          components.push(config);
        }
      }),
  );

  availableComponents = components
    .map(item => ({
      key: item.key,
      name: item.name,
      icon: item.icon,
      component: componentsMap[item.key],
    }))
    .sort(
      (a, b) =>
        ALL_APPLET_CONFIGS.findIndex(item => item.key === a.key)
        - ALL_APPLET_CONFIGS.findIndex(item => item.key === b.key),
    );
  activeComponentKey = availableComponents[0]?.key ?? '';
}

filterComponents();
</script>

<style lang="scss">
.creative-fe-devtools {
  .el-tabs {
    @apply flex flex-col h-full border-none;

    .el-tabs__header {
      @apply mb-0;
    }

    .el-tabs__content {
      @apply flex-1 p-0;
    }

    .el-tabs__item {
      @apply leading-[28px] h-[28px] text-[14px];

      &:hover:not(.is-disabled) {
        @apply text-gray-800;
      }

      &.is-active {
        @apply text-gray-900;
      }
    }

    .el-tab-pane {
      @apply h-full;
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      @apply leading-30px;
    }
  }
}
</style>
