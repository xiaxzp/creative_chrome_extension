<template>
  <div
    class="the-panel" :class="[{ 'is-visible': visible }]"
    :style="{
      transform: `translate3d(${spring.x}px, ${spring.y}px, 0)`,
      left: `${left}px`,
      top: `${top}px`,
      opacity: spring.opacity,
    }"
  >
    <ControlItem
      v-for="(item, idx) in controlList"
      :key="item.key"
      :app-key="item.key"
      :app-config="item"
      :style="{
        transform: `translateX(${itemSprings[idx].x}px)`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useSpring } from '@vueuse/motion';
import ControlItem from './ControlItem.vue';
import { useAvailableAppletList } from '~/hooks/appletEnablings';
import { useTracker } from '~/hooks/tracker';

const props = defineProps<{
  visible: boolean
  left: number
  top: number
}>();

const { trackEvent } = useTracker();

const appletList = useAvailableAppletList();

const controlList = computed(() =>
  appletList.value.filter(item => !item.hideInControlsCenter),
);

const spring = reactive({
  x: 270,
  y: -(controlList.value.length * 60 - 80),
  opacity: 0,
});
const { set } = useSpring(spring, { stiffness: 270, damping: 20.5 });

const itemSprings = controlList.value.map((_, idx) =>
  reactive({ x: 80 * (controlList.value.length - 1 - idx) }),
);
const itemSets = itemSprings.map(itemSpring =>
  useSpring(itemSpring, { stiffness: 200, damping: 20 }),
);

watch(
  () => props.visible,
  (val: boolean) => {
    set({
      y: -(controlList.value.length * 60 - 80),
      x: val ? 0 : 270,
      opacity: val ? 1 : 0,
    });
    itemSets.forEach((item, idx) => {
      item.set({ x: val ? 0 : 80 * (controlList.value.length - 1 - idx) });
    });

    if (val) {
      trackEvent('content_show_controls_center');
    }
  },
);
</script>

<style lang="scss">
.the-panel {
  @apply absolute top-20px left-20px;

  transform: translate3d(calc(-100% + 60px), calc(-100% - 20px));
  pointer-events: none;

  &.is-visible {
    will-change: transform;
    pointer-events: all;
  }
}
</style>
