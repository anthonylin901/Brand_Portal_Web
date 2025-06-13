<script setup lang="ts">
import { Instruction } from "hyena-brand-portal-api-client"
defineProps<{
  errorHandleInfo: Instruction
}>()
</script>

<template>
  <div class="error-instruction-box">
    <div class="error-name my-2">
      <span>{{ errorHandleInfo.error.name }}</span>
    </div>
    <div class="error-description my-3">
      <span>{{ errorHandleInfo.error.description }}</span>
    </div>
    <div class="error-handle-step">
      <div v-for="(value, key, index) in errorHandleInfo.action" :key="`${key}-${index}`">
        <hr class="list-line" />
        <div class="py-2 step-description">
          <div class="step">{{ key }}</div>
          <div class="ml-3">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-instruction-box {
  text-align: left;
}
.error-name {
  font-weight: 700;
  font-size: 1.5rem;
}
.error-description {
  font-weight: 600;
  font-size: 1.2rem;
  /* hyena */
  color: #404944;
}
.error-handle-step {
  font-size: 0.8rem;
  color: #191c1a;
}
.step-description {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  font-weight: 500;
}
.step {
  border: 2px solid;
  border-radius: 50%;
  text-align: center;
}
.list-line {
  /* hyena  */
  border: 1px solid #dbe5de;
}
</style>
