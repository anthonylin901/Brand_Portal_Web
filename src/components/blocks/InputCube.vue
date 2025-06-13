<script setup lang="ts">
import { reactive, watch, onMounted } from "vue"
import { wait } from "@/utils/common"

const props = defineProps<{
  modelValue: string
  boxAmount: number
  dashPosition?: number
  isInvalid?: boolean
  autoFocus?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void
}>()

const inputValue = reactive<(string | null)[]>([])

const inputChange = (value: InputEvent, cubePosition: number) => {
  inputValue[cubePosition - 1] = value.data
  if (value.data) {
    inputCubeFocus(cubePosition + 1)
  }
}

const handleKeyDown = async (event: KeyboardEvent, cubePosition: number) => {
  switch (event.key) {
    case "ArrowRight":
      inputCubeFocus(cubePosition + 1)
      break
    case "ArrowLeft":
      inputCubeFocus(cubePosition - 1)
      break
  }
}

const inputDelete = async (cubePosition: number) => {
  inputValue[cubePosition] = null
  await wait(0.1)
  inputCubeFocus(cubePosition - 1)
}

const inputCubeFocus = (cubePosition: number) => {
  const cube = document.getElementById(`inputBox${cubePosition}`) as HTMLInputElement
  const textLength = cube?.value.length
  textLength && cube.setSelectionRange(textLength, textLength)
  cube && cube.focus()
}

watch(inputValue, newValue => {
  emit("update:modelValue", newValue.join(""))
})

onMounted(() => {
  if (props.autoFocus) {
    inputCubeFocus(1)
  }
})
</script>
<template>
  <div class="ta-center m-5">
    <div class="flex justify-center">
      <div v-for="position in boxAmount" :key="position" class="mr-2 flex align-items-center">
        <input
          :id="`inputBox${position}`"
          maxlength="1"
          class="input-cube"
          :class="{ 'error-input': isInvalid }"
          @input="($event) => inputChange($event as InputEvent, position)"
          @keydown.delete="inputDelete(position)"
          @keydown="$event => handleKeyDown($event, position)" />
        <div v-if="position === dashPosition" class="ml-2 fw-bold">-</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.input-cube {
  text-align: center;
  background: none;
  width: 3.5rem;
  padding: 0.5rem;
  font-size: 2rem;
  border: 1px solid rgba(191, 201, 194, 1);
  border-radius: 0.5rem;
  transition: 0.1s all ease;
  font-weight: 700;
}

.input-cube:focus {
  padding: calc(0.5rem - 1.5px);
  border: 2px solid rgba(0, 108, 77, 1);
  transition: 0.1s all ease;
}

.error-input {
  padding: calc(0.5rem - 1.5px);
  border: 2px solid rgba(186, 26, 26, 1) !important;
}
</style>
