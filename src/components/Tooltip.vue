<template>
  <el-tooltip :append-to="portal" v-bind="$attrs">
    <template #content>
      <div class="inner-content w-max max-w-360px flex justify-center">
        <slot name="content">
          {{ $attrs.content }}
        </slot>
      </div>
    </template>
    <slot />
  </el-tooltip>
</template>

<script setup lang="ts">
import { getPopperPortal } from '~/content/utils';

const portal = getPopperPortal();
</script>

<style lang="scss">
</style>
