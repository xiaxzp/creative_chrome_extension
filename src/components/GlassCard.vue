<template>
  <section
    ref="cardEl"
    class="glass-card min-w-300px rounded-10px" :class="[{ draggable, shrinked }]"
    p="x-13px t-10px b-15px"
    tabindex="1"
    :pos="draggable ? 'fixed left-10px top-10px' : ''"
    style="visibility: hidden"
    :style="{ zIndex, transform: `translate(${-1 * offset.x}px, ${-1 * offset.y}px)` }"
    @click="pinTop"
    @keydown.alt.exact="onKeydown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <header
      font="bold"
      class="-mx-13px px-13px -mt-10px pt-6px flex items-center cursor-move"
      @mousedown.stop="onDragStart"
      @dblclick="
        () => {
          onDoubleClick();
          emit('header-dblclick');
        }
      "
    >
      <transition name="window-control">
        <div
          v-if="showWindowControlPanel"
          class="window-control-panel mb-10px flex"
          pos="absolute"
        >
          <div class="window-control-dot close" @click="emit('shutdown')">
            <codicon:chrome-close class="dot-icon" />
          </div>
          <div
            v-if="!shrinked"
            class="window-control-dot minimize"
            @click="onDoubleClick"
          >
            <codicon:chrome-minimize class="dot-icon" />
          </div>
          <div
            v-else
            class="window-control-dot maximize"
            @click="onDoubleClick"
          >
            <codicon:chrome-maximize class="dot-icon" />
          </div>
        </div>
      </transition>

      <div
        v-if="resizeable"
        pos="relative"
        display="flex"
        justify="center"
        align="items-center"
        rounded="10px"
        cursor="move"
        @dblclick.stop
      >
        <ion:drag w="12px" cursor="ns-resize" @mousedown.stop />
      </div>

      <slot name="header" />

      <div
        v-if="title || $slots.title"
        select="none"
        display="flex"
        text="15.75px"
        leading="24.5px"
        m="b-10px"
        :style="{ transform: `translateX(${titleTranslate.x}px)` }"
      >
        <img
          v-if="iconAssetPath"
          width="15"
          m="l-3.5px r-7px"
          select="none"
          alt=""
          :src="iconAssetPath"
        >
        <strong>
          <slot name="title">
            {{ title }}
          </slot>
        </strong>
      </div>
    </header>

    <div v-show="!shrinked">
      <slot :shrinked="shrinked" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSpring } from '@vueuse/motion';
import { clamp } from 'lodash-es';
import useMaxZIndex, { ZIndexKeys } from '~/hooks/maxZIndex';
import { getExtensionAssetPath } from '~/utils/browser';

const props = defineProps<{
  draggable?: boolean
  resizeable?: boolean
  shrinkable?: boolean
  title?: string
  icon?: string
  recordKey?: string // sessionStorage 的 key 名，用来保存最后一次 drag 的位置信息
  focusTrigger?: any // whenever this props change, will click this card to focus
  withWindowControl?: boolean
}>();

const emit = defineEmits(['close', 'shutdown', 'header-dblclick']);

const iconAssetPath = getExtensionAssetPath(props.icon);

const _dragging = ref(false);
const startXY = reactive({
  x: 0,
  y: 0,
});
const offset = reactive({
  x: 0,
  y: 0,
});
const offsetWhenLastDragEnd = reactive({
  x: 0,
  y: 0,
});

const zIndex = ref(useMaxZIndex(ZIndexKeys.GlassCard));

const memoedPositionKey = `${props.recordKey ?? ''}-position`;

// restore last position
if (props.draggable && props.recordKey) {
  try {
    const storedOffset = JSON.parse(
      localStorage.getItem(memoedPositionKey) ?? '{}',
    );
    Object.assign(offsetWhenLastDragEnd, storedOffset);
    Object.assign(offset, storedOffset);
  }
  catch {}
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onDrop);

  return () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onDrop);
  };
});

const cardEl = ref<HTMLElement | null>(null);
watch(
  () => props.focusTrigger,
  () => {
    setTimeout(() => {
      cardEl.value?.click();
      cardEl.value?.focus();
    }, 0);
  },
);

function onDragStart(evt: MouseEvent) {
  if (!props.draggable) {
    return;
  }
  startXY.x = evt.screenX;
  startXY.y = evt.screenY;
  _dragging.value = true;

  zIndex.value = useMaxZIndex(ZIndexKeys.GlassCard);
}

function onDrop() {
  if (_dragging.value) {
    Object.assign(offsetWhenLastDragEnd, offset);
    _dragging.value = false;

    // record position in sessionStorage
    if (props.recordKey) {
      localStorage.setItem(memoedPositionKey, JSON.stringify(offset));
    }
  }
}

function onMouseMove(evt: MouseEvent) {
  if (!_dragging.value) {
    return;
  }

  const { x = 0, width = 0 } = cardEl.value?.getBoundingClientRect() ?? {};
  const fixedLeft = x + offset.x;

  offset.x = startXY.x - evt.screenX + offsetWhenLastDragEnd.x;
  offset.y = startXY.y - evt.screenY + offsetWhenLastDragEnd.y;

  offset.x = clamp(
    offset.x,
    -window.innerWidth + fixedLeft + 30,
    fixedLeft + width - 30,
  );
  offset.y = clamp(offset.y, -window.innerHeight + 50, 10);
}

function onKeydown(event) {
  if (event.code === 'KeyW') {
    emit('close');
  }
}

function pinTop() {
  zIndex.value = useMaxZIndex(ZIndexKeys.GlassCard);
}

// === Dounble click shrink ===//
const memoedShrinkKey = `${props.recordKey ?? ''}-shrink`;
const shrinked = ref(Boolean(Number(localStorage.getItem(memoedShrinkKey))));

function onDoubleClick() {
  if (!props.shrinkable) {
    return;
  }
  shrinked.value = !shrinked.value;

  localStorage.setItem(memoedShrinkKey, shrinked.value ? '1' : '0');
}

// === Window Control ===
const titleTranslate = reactive({ x: 0 });
const showWindowControlPanel = ref(false);
const { set } = useSpring(titleTranslate, { stiffness: 210, damping: 20.5 });

function onMouseEnter() {
  if (props.withWindowControl) {
    showWindowControlPanel.value = true;
    if (props.title) {
      set({
        x: 36,
      });
    }
  }
}

function onMouseLeave() {
  if (
    (props.withWindowControl || showWindowControlPanel.value)
    && !_dragging.value
  ) {
    showWindowControlPanel.value = false;
    if (props.title) {
      set({
        x: 0,
      });
    }
  }
}

// === Resize Detect ===
// If cards are out of screen due to resize, get them in automatically
window.addEventListener('resize', () => {
  if (cardEl.value) {
    let dirty = false;
    const { x, y, width } = cardEl.value.getBoundingClientRect();

    if (x + 30 > window.innerWidth) {
      dirty = true;
      offset.x = -1 * (window.innerWidth - 30);
    }

    if (x + width < 30) {
      dirty = true;
      offset.x = -1 * (30 - width);
    }

    if (y + 50 > window.innerHeight) {
      dirty = true;
      offset.y = -1 * (window.innerHeight - 50);
    }

    if (y < 0) {
      dirty = true;
      offset.y = 0;
    }

    if (dirty) {
      Object.assign(offsetWhenLastDragEnd, offset);
      if (props.recordKey) {
        localStorage.setItem(memoedPositionKey, JSON.stringify(offset));
      }
    }
  }
});
</script>

<style lang="scss">
.glass-card {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  border: 0.5px solid rgba(174, 174, 174, 0.57);
  border-top-color: rgba(174, 174, 174, 0.37);
  max-height: 100vh;

  /*
  // 为了防止在 CSS 未插入前展示出没有样式的 DOM，我们先 inline 了 visibility 为 hidden，
  // 等 style.css 被加载后，再强制设置为 visible
  */
  visibility: visible !important;

  &.shrinked {
    max-height: 38px;
    padding-bottom: 0;
    padding-right: 17px;
    min-width: 200px;
    contain: paint;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.07);

    > header {
      margin-bottom: -3px;
    }
  }

  .window-control-panel {
    .window-control-dot {
      @apply w-10px h-10px rounded-full border border-solid flex items-center justify-center cursor-pointer;

      &.close {
        @apply bg-[#ff605c] border-red-600;
      }

      &.minimize {
        @apply bg-[#ffbd44] border-orange-400;
      }

      &.maximize {
        @apply bg-[#00ca4e] border-green-600;
      }

      &:not(:first-of-type) {
        @apply ml-6px;
      }
    }

    .dot-icon {
      visibility: hidden;
      font-size: 7px;
      font-weight: bolder;
    }

    &:hover {
      .dot-icon {
        visibility: visible;
      }
    }
  }
}

.drag-handler {
  @apply mt-20px mx-auto h-5px w-50 rounded;

  background-color: #13131343;
}

.window-control-enter-active,
.window-control-leave-active {
  transition: all 0.2s cubic-bezier(0.15, 0.84, 0.3, 0.95);
}

.window-control-enter-active {
  transition-delay: 0.15s;
}

.window-control-enter-from,
.window-control-leave-to {
  opacity: 0;
}
</style>
