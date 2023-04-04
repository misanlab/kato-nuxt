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
      class="mt-8 rounded-lg shadow-md bg-white px-4 py-6 sm:px-8 sm:py-8 space-y-6 max-w-md border border-slate-200 w-full"
    >
      <div class="flex flex-col">
        <span class="text-sm text-slate-500 mb-2 text-center">
          Enter your email below and we'll send you link to log in.
        </span>

        <n-input
          v-model:value="emailAddress"
          type="text"
          size="large"
          placeholder="ea@sjy.so"
          :type="email"
        />

        <!-- <n-input
          v-model:value="emailAddress"
          type="text"
          size="large"
          placeholder="ea@sjy.so"
          :type="email"
        /> -->
      </div>

      <!-- <div class="flex justify-center">
        <n-button strong secondary type="primary" @click="submitEmailAddress">
          Sign In
        </n-button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { NCard, NInput, NButton } from "naive-ui";
import { isEmail } from "validator";
import axios from "axios";

const runtimeConfig = useRuntimeConfig();

const emailAddress = ref("njdtihbceivcynjxls@tpwlb.com");

const submitEmailAddress = async () => {
  if (emailAddress.value === "") {
    return;
  }

  if (!isEmail(emailAddress.value)) {
    return;
  }

  console.log(emailAddress.value);

  const response = await axios.post("/api/login", {
    emailAddress: emailAddress.value,
  });

  console.log(response);
};
</script>
