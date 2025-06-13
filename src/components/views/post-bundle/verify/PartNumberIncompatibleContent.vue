<script setup lang="ts">
import { IncompatiblePartNumberKey } from "@/types/enums"

const stepList = [
  {
    key: IncompatiblePartNumberKey.IS_INCORRECT_BIKE_MODEL,
    title: "Is the selected bike model correct?",
    content: "If incorrect, reselect and try approve again to see if problem solved.",
  },
  {
    key: IncompatiblePartNumberKey.ASK_BIKE_SHOP_FOR_PARTS_REPLACEMENT,
    title: "Ask the bike shop for parts replacement",
    content:
      "If the selected bike model is correct, instruct the bike shop to replace the parts according to specifications.",
  },
  {
    key: IncompatiblePartNumberKey.ASK_BIKE_SHOP_TO_CONNECT_BIKE_AND_SUBMIT_FORM_AGAIN,
    title: "Ask the bike shop to connect bike and submit form again",
    content:
      "“After part replacement”, reconnect the bike to <strong>Dealer Portal</strong> and resubmit the form to update information.",
  },
  {
    key: IncompatiblePartNumberKey.VERIFY_THE_INFORMATION_AND_TRY_APPROVE_AGAIN,
    title: "Verify the information and try approve again",
    content: "Please go to <strong>Post-bundle (DP)</strong> to verify the updated information with the bike shop again.",
  },
]

</script>

<template>
  <div class="content-box">
    <div class="title-divide" />
    <h3 class="p-3">Follow the steps below and guide the bike shop</h3>
    <div v-for="(step, index) in stepList" :key="step.key" class="step-box px-3 pb-2 mb-2">
      <span>Step {{ `${index + 1}`.padStart(2, "0") }}</span> <br />
      <h3>{{ step.title }}</h3>
      <span v-html="step.content"/>
    </div>
  </div>
</template>
<style scoped>
.title-divide {
  border-bottom: 1px solid rgba(225, 227, 223, 1);
  margin-top: 20px;
}
.content-box {
  margin: -24px;
}
h3 {
  margin: 5px auto;
}
.step-box {
  width: 100%;
  border-bottom: 1px solid rgba(225, 227, 223, 1);
}
</style>
