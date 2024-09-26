<template>
  <img
    :src="otherGradient ? gradient2 : gradient1"
    alt="/"
    rounded="1/2"
    h="full"
    w="full"
    class="object-cover the-ring"
    :class="{ isReverse: reverseSpin }"
  >
</template>

<script setup lang='ts'>
defineProps<{
  otherGradient?: boolean
  reverseSpin?: boolean
}>();

const gradient1 = browser.runtime.getURL('imgs/ring-g1.jpg');
const gradient2 = browser.runtime.getURL('imgs/ring-g2.jpg');
</script>

<style lang='scss'>
.the-ring {
  mask: radial-gradient(transparent 42%, #000 43%);
  animation-name: spin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-play-state: paused;
  -webkit-user-drag: none;

  &.isReverse {
    animation-direction: alternate;
    animation-duration: 3s;
  }
}

@keyframes spin {
  50% {
    transform: rotate(360deg);
  }
  70% {
    transform: rotate(480deg);
  }
  100% {
    transform: rotate(720deg);
  }
}
</style>
