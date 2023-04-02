<template>
  <div>
    <LottiePlayer
      animationLink="https://assets6.lottiefiles.com/packages/lf20_87uabjh2.json"
      :height="200"
      :width="200"
    />

    <n-input
      v-model:value="emailAddress"
      type="text"
      placeholder="ea@sjy.so"
      :type="email"
    />

    <n-button @click="submitEmailAddress">Submit</n-button>

    <div class="my-2"></div>

    <NCard title="Card"> Card Content </NCard>
  </div>
</template>

<script setup>
import { NCard, NInput, NButton } from "naive-ui";
import { isEmail } from "validator";
import axios from "axios";

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
