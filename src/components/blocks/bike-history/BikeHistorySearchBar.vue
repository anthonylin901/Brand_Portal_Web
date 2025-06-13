<script setup lang="ts">
import { ref } from "vue"
import { Input, Icons, Variant } from "hyena-design-system"
import { bikeStore } from "@/stores"

const props = defineProps<{
  isShowDefaultFrameNumber?: boolean
  isShowLabel?: boolean
  isError?: boolean
}>()

const emit = defineEmits<{
  (e: "searchFrameNumber", frameNumber: string): void
}>()

const frameNumber = ref(
  props.isShowDefaultFrameNumber ? (bikeStore.currentBikeInfoData?.vin as string) : ""
)

const submit = () => {
  if (frameNumber.value !== "") {
    emit("searchFrameNumber", frameNumber.value)
  }
}
const toUpperCase = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  frameNumber.value = inputElement.value.toUpperCase()
}

const clearValue = () => {
  frameNumber.value = ""
}
</script>

<template>
  <div class="search-input-box">
    <Input
      v-model.trim="frameNumber"
      :label="isShowLabel ? 'Frame Number' : ''"
      placeholder="Please search frame number"
      is-outlined
      :variant="isError ? Variant.ERROR : ''"
      :trailing-icon="frameNumber.length > 0 ? Icons.CLOSE : undefined"
      :leading-icon="Icons.SEARCH"
      @click-icon="clearValue"
      @input="toUpperCase"
      @keyup.enter="submit()" />
  </div>
</template>

<style scoped>
:deep(.trailing-field) {
  cursor: pointer;
}
:deep(input) {
  height: 56px;
}
:deep(i::before) {
  font-size: 1.5rem;
}
:deep(.input-label) {
  top: -0.8rem;
  font-size: 14px;
}

.search-input-box {
  font-size: 1rem;
  min-width: 360px;
}
@media only screen and (max-width: 1700px) {
  .search-input-box {
    min-width: 333px;
  }
}
@media only screen and (max-width: 1200px) {
  .search-input-box {
    min-width: 300px;
    font-size: 0.8rem;
  }
}
</style>
