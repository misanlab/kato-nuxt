<template>
  <div class="flex flex-col w-full max-w-screen-sm items-center">
    <ClientOnly>
      <LottiePlayer
        animationLink="https://assets6.lottiefiles.com/packages/lf20_87uabjh2.json"
        :height="150"
        :width="150"
      />
    </ClientOnly>

    <h1 class="mt-4 text-2xl sm:text-4xl text-center font-bold">
      Let's get you logged in!
    </h1>

    <div
      class="mt-4 rounded-lg shadow-md bg-white px-4 py-6 sm:px-8 sm:py-8 space-y-6 max-w-sm border border-slate-200 w-full"
    >
      <div class="flex flex-col">
        <span class="text-sm text-slate-500 mb-3 text-center">
          Enter your email below and we'll send you link to log in.
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
          @click="submitEmailAddress"
          size="large"
          :disabled="invalidEmailAddress"
        >
          Sign In
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInput, NButton } from "naive-ui";
import isEmail from "validator/es/lib/isEmail";
import axios from "axios";

const runtimeConfig = useRuntimeConfig();
const router = useRouter();

const emailAddress = ref("njdtihbceivcynjxls@tpwlb.com");

const invalidEmailAddress = computed(() => {
  return emailAddress.value === "" || !isEmail(emailAddress.value);
});

const submitEmailAddress = async () => {
  if (invalidEmailAddress.value) return;

  router.push({
    path: "/auth",
    query: { emailAddress: encodeURIComponent(emailAddress.value) },
  });

  // const response = await axios.post("/api/login", {
  //   emailAddress: emailAddress.value,
  // });

  // if (response.status === 200) {
  //   console.log("Email sent!");

  //   router.push({
  //     path: "/auth",
  //     query: { emailAddress: encodeURIComponent(emailAddress.value) },
  //   });
  // } else {
  //   console.log("Something went wrong!");
  // }

  // console.log(response);
};
</script>
