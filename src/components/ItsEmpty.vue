<template>
  <section class="flex justify-center items-center" min-h="200px" role="empty-hint">
    <p text="18px gray-500">
      {{ words }}
    </p>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ content?: string }>();

const words = props.content ?? '🤪 Nothing yet';
</script>

<style lang="scss">
</style>
