<template>
  <main
    ref="containerRef" font="sans" pos="fixed bottom-15px right-15px" z="9999" p="t-20px"
    style="visibility: hidden"
  >
    <Tooltip placement="top" content="Click" :disabled="noControlledExtensionAvailable || panelVisible">
      <div
        v-if="!noControlledExtensionAvailable" ref="buttonRef" role="button" w="55px" h="55px" z="10" pos="relative"
        class="the-button max-w-20vw max-h-20vw" :data-panel-visible="panelVisible" @mouseup="onBtnMouseUp"
        @mousedown="onBtnMouseDown" @click="() => { }"
      >
        <div pos="absolute" h="full" opacity="75" class="ring-box">
          <Ring />
        </div>
        <div pos="absolute" h="full" class="ring-box">
          <Ring reverse-spin other-gradient />
        </div>
        <div pos="absolute" h="full" opacity="75" class="ring-box">
          <Ring />
        </div>
        <div pos="absolute" h="full" opacity="50" class="ring-box">
          <Ring />
        </div>

        <!-- 控制中心  -->
        <TheOnePanel :visible="panelVisible" :left="-160" :top="-60" @mouseup.stop />
      </div>
    </Tooltip>
  </main>
</template>

<script setup lang='ts'>
import { onClickOutside, useDraggable, useStorage } from '@vueuse/core';
import { clamp } from 'lodash-es';
import Ring from './TheRing.vue';
import TheOnePanel from './TheOnePanel.vue';
import { useAvailableAppletList } from '~/hooks/appletEnablings';
import { useTracker } from '~/hooks/tracker';

const { trackPageview, trackEvent } = useTracker();

onMounted(() => {
  trackPageview();
  trackEvent('content_show_page');
});

const containerRef = ref<HTMLDivElement | null>(null);

const buttonRef = ref<HTMLDivElement | null>(null);

const appletList = useAvailableAppletList();

const panelVisible = ref(false);

onClickOutside(
  containerRef,
  (_) => {
    panelVisible.value = false;
  },
  {
    capture: false,
    ignore: [document.querySelector('creative-fe-devtool') as HTMLElement],
  },
);

const storedPosition = useStorage(
  'control-center-position',
  { x: window.innerWidth - 70, y: window.innerHeight - 70 },
  sessionStorage,
);

useDraggable(buttonRef, {
  initialValue: storedPosition.value,
  onMove(position) {
    storedPosition.value.x = clamp(position.x + 70, 70, window.innerWidth + 30);
    storedPosition.value.y = clamp(
      position.y + 70,
      70,
      window.innerHeight + 30,
    );
  },
});

const noControlledExtensionAvailable = computed(
  () => appletList.value.filter(item => !item.hideInControlsCenter).length === 0,
);

// === Resize Detect ===

let mouseDownTime = 0;

function onBtnMouseUp() {
  // 为了防止和拖拽冲突，只有当鼠标点击和抬起发生在 X ms 内的，我们才认为是 click，否则认为是拖拽
  if (Date.now() - mouseDownTime < 200) {
    togglePanelVisible();
    trackEvent('content_click_ring');
  }
}

function onBtnMouseDown() {
  mouseDownTime = Date.now();
}

function togglePanelVisible() {
  if (noControlledExtensionAvailable.value) {
    return;
  }
  panelVisible.value = !panelVisible.value;
}
</script>

<style lang='scss'>
.the-button {
  font-size: 0;
  /*
  // 为了防止在 CSS 未插入前展示出没有样式的 DOM，我们先 inline 了 visibility 为 hidden，
  // 等 content.css 被加载后，再强制设置为 visible
  */
  visibility: visible !important;

  &[data-panel-visible='true'],
  &:focus-within {
    >.ring-box {

      &:nth-of-type(1),
      .the-ring {
        animation-play-state: running;
      }
    }
  }
}

.ring-box {
  @apply cursor-pointer;

  &:nth-of-type(1) {
    filter: blur(5px);
    transform: skew(350deg, 16deg) rotate(0);
    animation: force-reverse-spin 3s linear infinite;
    animation-play-state: paused;
  }

  &:nth-of-type(2) {
    transform: skew(350deg, 16deg) scale(1.08);
    mix-blend-mode: color;
  }

  &:nth-of-type(3) {
    transform: skew(0, -5deg);
  }

  &:nth-of-type(4) {
    transform: rotate(303deg) skew(347deg, 14deg) scale(1.01);
  }
}

@keyframes force-reverse-spin {
  100% {
    transform: skew(350deg, 16deg) rotate(-720deg);
  }
}
</style>
