<template>
  <div class="relative flex h-screen w-full flex-col items-center justify-center">
    <div class="header fixed right-4 top-2 flex justify-end space-x-2 text-slate-800">
      <NuxtLink to="/">
        <Icon
          icon="material-symbols:home-outline-rounded"
          height="30"
          width="30"
          class="text-slate-800 transition-colors hover:text-slate-500"
        />
      </NuxtLink>
      <NuxtLink to="/settings">
        <Icon
          icon="material-symbols:settings-applications-rounded"
          height="30"
          width="30"
          class="text-slate-800 transition-colors hover:text-slate-500"
        />
      </NuxtLink>
      <NuxtLink to="/login">
        <Icon
          icon="ri:user-received-fill"
          height="30"
          width="30"
          class="text-slate-800 transition-colors hover:text-slate-500"
        />
      </NuxtLink>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
