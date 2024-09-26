<template>
  <div class="control-item-container w-250px" m="b-7px">
    <div
      cursor="pointer"
      class="control-item flex items-start"
      p="8px"
      rounded="l-30px r-8px"
      @click="toggleEnable"
    >
      <div
        m="r-10px"
        w="30px"
        h="30px"
        :bg="
          enabled
            ? controlStore.hideAllApplets
              ? 'blue-300'
              : 'blue-500'
            : 'gray-200'
        "
        flex="~"
        overflow="hidden"
        :data-enabled="enabled"
        class="control-item-indicator rounded-1/2 items-center justify-center"
      >
        <img width="15" select="none" :src="getExtensionAssetPath(icon)">
      </div>

      <div class="flex flex-col justify-between self-stretch" select="none">
        <strong font="leading-tight" text="sm" m="-b-3px" display="block">{{
          name
        }}</strong>
        <small text="gray-400 xs">{{
          enabled
            ? `Enabled ${controlStore.hideAllApplets ? ' (Invisible)' : ''}`
            : 'Disabled'
        }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { snakeCase } from 'lodash-es';
import { controlStore } from '../shared';
import type { AppletConfig } from '~/create/interface';
import { getExtensionAssetPath } from '~/utils/browser';
import { useAppletEnabled } from '~/hooks/appletEnablings';
import { useTracker } from '~/hooks/tracker';

const props = defineProps<{
  appConfig: AppletConfig
}>();

const { trackEvent } = useTracker();

const { name, icon } = toRefs(props.appConfig);

const [enabled, toggle] = useAppletEnabled(props.appConfig);

function toggleEnable() {
  if (!enabled.value) {
    trackEvent(`content_click_enable_${snakeCase(props.appConfig.key)}`);
  }

  toggle();
}
</script>

<style lang="scss">
.control-item {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);

  &:hover {
    background-color: white;
  }

  &-container {
    filter: drop-shadow(0 3px 6px rgb(0 0 0 / 12%));
  }

  &-indicator {
    transition: 0.12s ease-in;

    &[data-enabled='true'] {
      > img {
        filter: drop-shadow(-100px 0 0 white);
      }
    }

    > img {
      position: relative;
      left: 100px;
      filter: drop-shadow(-100px 0 0 black);
    }
  }
}
</style>
