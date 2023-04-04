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
        <h2 class="mt-2 mb-2 text-lg sm:text-xl text-center font-semibold">
          Please check your email
        </h2>

        <p class="text-base text-slate-500 mb-8 mt-2 text-center">
          Enter the code we've sent to
          <span class="font-medium"> {{ emailAddress }}. </span>
        </p>

        <n-input
          v-model:value="authCode"
          type="text"
          :allow-input="onlyAllowNumber"
          size="large"
          placeholder="16180"
          maxlength="5"
          class="text-center"
        />
      </div>

      <div class="flex justify-between space-x-4 items-center">
        <n-popover trigger="hover" :width="200" placement="bottom-start">
          <template #trigger>
            <span> Need help? </span>
          </template>
          <span>
            It may take a minute to receive your code. Check your spam folder if
            you don't see it in your inbox.
          </span>
        </n-popover>

        <n-button
          strong
          secondary
          type="primary"
          size="large"
          :disabled="invalidAuthCode"
          :loading="loading"
          @click="submitAuthCode"
        >
          Sign In
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInput, NButton, NPopover } from "naive-ui";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const loading = ref(false);

const authCode = ref("");

const emailAddress = ref("");
const rawAuthURL = ref("");

emailAddress.value = decodeURIComponent(route.query.emailAddress as string);
rawAuthURL.value = decodeURIComponent(route.query.code as string);

if (
  rawAuthURL.value !== "undefined" &&
  rawAuthURL.value !== "" &&
  rawAuthURL.value.search(":")
) {
  // split the url to get the auth code
  emailAddress.value = rawAuthURL.value.split(":")[0];
  authCode.value = rawAuthURL.value.split(":")[1];
}

const onlyAllowNumber = (value: string) => {
  return /^\d*$/.test(value);
};

const invalidAuthCode = computed(() => {
  return authCode.value === "" || authCode.value.length !== 5;
});

const submitAuthCode = async () => {
  loading.value = true;

  if (invalidAuthCode.value) return;

  const response = await axios.post("/api/login/auth", {
    emailAddress: emailAddress,
    authCode: authCode.value,
  });

  if (response.status === 200) {
    // store tokens

    router.push({
      path: "/",
    });
  } else {
    console.log("Something went wrong!");
  }

  // console.log(response);
};
</script>
