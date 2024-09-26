<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import type { JSONDataType } from 'vue-json-pretty/types/utils';
import 'vue-json-pretty/lib/styles.css';

defineProps<{
  data?: JSONDataType
  fontSize?: number
  lineHeight?: number
  editable?: boolean
  editableTrigger?: 'click' | 'dblclick'
}>();
</script>

<template>
  <div class="json-viewer">
    <VueJsonPretty
      class="mt-2"
      :style="{
        fontSize: `${fontSize ?? 12}px`,
        lineHeight: `${lineHeight ?? 16}px`,
      }"
      :data="data"
      :show-line="false"
      :show-double-quotes="false"
      :show-length="true"
      :deep="3"
      :editable="editable"
      :editable-trigger="editableTrigger"
      v-bind="$attrs"
    />
  </div>
</template>

<style lang="scss">
.json-viewer {
  .vjs-tree {
    .vjs-key {
      @apply text-fuchsia-700;
      flex-shrink: 0;

      margin-right: 5px;
    }
    .vjs-value {
      &.vjs-value-string {
        @apply text-red-600;
        @apply break-all;
      }
      &.vjs-value-number {
        @apply text-blue-700;
      }
      &.vjs-value-boolean {
        @apply text-lime-700;
      }
      &.vjs-value-null {
        @apply text-amber-700;
      }
    }
    .vjs-tree-node:hover {
      background: none;
    }
  }
}
</style>
