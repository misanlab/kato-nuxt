<template>
  <client-only>
    <Vue3Lottie :animation-link="animationLink" :height="height" :width="width" />
  </client-only>
</template>

<script setup>
// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps({
  animationLink: {
    required: true,
    type: String,
  },
  height: {
    required: true,
    type: Number,
  },
  width: {
    required: true,
    type: Number,
  },
});
</script>
