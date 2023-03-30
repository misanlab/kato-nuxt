<template>
  <client-only>
    <Vue3Lottie
      :animationLink="animationLink"
      :height="height"
      :width="width"
    />
  </client-only>
</template>

<script setup>
const props = defineProps({
  animationLink: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
});
</script>
