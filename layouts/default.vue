<template>
  <div
    class="w-full h-screen flex flex-col justify-center items-center relative"
  >
    <div
      class="header fixed top-2 right-4 flex justify-end space-x-2 text-slate-800"
    >
      <NuxtLink to="/">
        <Icon
          icon="material-symbols:home-outline-rounded"
          height="30"
          width="30"
          class="text-slate-800 hover:text-slate-500 transition-colors"
        />
      </NuxtLink>
      <NuxtLink to="/settings">
        <Icon
          icon="material-symbols:settings-applications-rounded"
          height="30"
          width="30"
          class="text-slate-800 hover:text-slate-500 transition-colors"
        />
      </NuxtLink>
      <NuxtLink to="/login">
        <Icon
          icon="ri:user-received-fill"
          height="30"
          width="30"
          class="text-slate-800 hover:text-slate-500 transition-colors"
        />
      </NuxtLink>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
