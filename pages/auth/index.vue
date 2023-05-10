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
        <h2 class="mb-2 mt-2 text-center text-lg font-semibold sm:text-xl">
          Please check your email
        </h2>

        <p class="mb-8 mt-2 text-center text-base text-slate-500">
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

      <div class="flex items-center justify-between space-x-4">
        <n-popover trigger="hover" :width="200" placement="bottom-start">
          <template #trigger>
            <span class="cursor-help"> Need help? </span>
          </template>
          <span>
            It may take a minute to receive your code. Check your spam folder if you don't see it in
            your inbox.
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
import axios from "axios";
import { NButton, NInput, NPopover } from "naive-ui";

const route = useRoute();
const router = useRouter();

const loading = ref(false);

const authCode = ref("");

const emailAddress = ref("");
const rawAuthURL = ref("");

emailAddress.value = decodeURIComponent(route.query.emailAddress as string);
rawAuthURL.value = decodeURIComponent(route.query.code as string);

if (rawAuthURL.value !== "undefined" && rawAuthURL.value !== "" && rawAuthURL.value.search(":")) {
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
    authCode: authCode.value,
    emailAddress: emailAddress.value,
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

onMounted(() => {
  console.log("mounted");
  // submitAuthCode();
});
</script>
