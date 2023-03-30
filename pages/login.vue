<template>
  <div>
    <LottiePlayer
      animationLink="https://assets6.lottiefiles.com/packages/lf20_87uabjh2.json"
      :height="200"
      :width="200"
    />
    <NCard title="Card"> Card Content </NCard>
  </div>
</template>

<script setup>
import { NCard } from "naive-ui";
</script>
