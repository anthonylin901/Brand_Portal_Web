<script setup lang="ts">
import { defineProps } from "vue"
import { IncompatiblePartNumberKey } from "@/types/enums"
const props = defineProps<{
  skipKey?: string
}>()

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
    key: IncompatiblePartNumberKey.VERIFY_THE_INFORMATION_AND_TRY_APPROVE_AGAIN,
    title: "Verify the information and try approve again",
    content: "Verify the updated information with bike shop again.",
  },
]

const filteredStepList = stepList.filter(step => step.key !== props.skipKey)
</script>

<template>
  <div class="content-box">
    <div class="p-3 fw-bold mt-2">Follow the steps below and guide the bike shop</div>
    <div v-for="(step, index) in filteredStepList" :key="step.key" class="step-box px-3 pb-2 mb-2">
      <span class="fs-label">Step {{ `${index + 1}`.padStart(2, "0") }}</span> <br />
      <h3 class="fw-semi-bold fs-title">{{ step.title }}</h3>
      <span class="fs-body">{{ step.content }}</span>
    </div>
  </div>
</template>
<style scoped>
.content-box {
  margin: -24px;
  border-top: 1px solid rgba(225, 227, 223, 1);
  color: #191c1a;
}
h3 {
  margin: 5px auto;
}
.step-box {
  width: 100%;
  border-bottom: 1px solid rgba(225, 227, 223, 1);
}
</style>
