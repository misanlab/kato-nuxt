<template>
  <div class="flex w-full max-w-screen-sm flex-col items-center">
    <ClientOnly>
      <LottiePlayer
        animation-link="https://assets6.lottiefiles.com/packages/lf20_87uabjh2.json"
        :height="150"
        :width="150"
      />
    </ClientOnly>

    <h1 class="mt-4 text-center text-2xl font-bold sm:text-4xl">Let's get you logged in!</h1>

    <div
      class="mt-4 w-full max-w-sm space-y-6 rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-md sm:px-8 sm:py-8"
    >
      <div class="flex flex-col">
        <span class="mb-3 text-center text-sm text-slate-500">
          Enter your email below to get started.
        </span>

        <n-input
          v-model:value="emailAddress"
          type="text"
          size="large"
          placeholder="ea@sjy.so"
          class="text-center"
        />
      </div>

      <div class="flex justify-center">
        <n-button
          strong
          secondary
          type="primary"
          size="large"
          :loading="loading"
          :disabled="invalidEmailAddress"
          @click="submitEmailAddress"
        >
          Sign In
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { NButton, NInput } from "naive-ui";
import isEmail from "validator/es/lib/isEmail";

const router = useRouter();

const loading = ref(false);

const emailAddress = ref("njdtihbceivcynjxls@tpwlb.com");

const invalidEmailAddress = computed(() => {
  return emailAddress.value === "" || !isEmail(emailAddress.value);
});

const submitEmailAddress = async () => {
  loading.value = true;

  if (invalidEmailAddress.value) return;

  const response = await axios.post("/api/login", {
    emailAddress: emailAddress.value,
  });

  loading.value = false;

  if (response.status === 200) {
    console.log("Email sent!");

    router.push({
      path: "/auth",
      query: { emailAddress: encodeURIComponent(emailAddress.value) },
    });
  } else {
    console.log("Something went wrong!");
  }
};
</script>
