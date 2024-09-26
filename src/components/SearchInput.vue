<template>
  <el-input
    v-bind="$attrs"
    class="search-input"
  />
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.search-input.search-input {
  --el-input-border-color: transparent;
  --el-input-focus-border-color: transparent;
  --el-input-bg-color: rgba(68, 68, 68, 0.13);
  --el-text-color-placeholder: rgba(0, 0, 0, 0.334);
  --height: 32px;

  line-height: var(--height);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;

  > .el-input__inner {
    height: var(--height);
    line-height: var(--height);
    border: none;
  }
}
</style>
