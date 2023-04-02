<template>
  <div
    class="w-full h-screen flex flex-col justify-center items-center relative"
  >
    <div class="header fixed top-0 w-full flex justify-between">
      <NuxtLink to="/">Home page</NuxtLink>
      <NuxtLink to="/login">Login</NuxtLink>
    </div>
    <slot />
  </div>
</template>
