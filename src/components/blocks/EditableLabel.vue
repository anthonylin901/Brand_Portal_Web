<script setup lang="ts">
import { ref } from "vue"
import { Icon, Icons, Input, Button, Variant } from "hyena-design-system"

const props = defineProps<{
  modelValue: string
  editable: boolean
  description?: string
  title?: string
  error?: boolean
  errorIcon?: Icons
  note?: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void
  (e: "clickErrorIcon"): void
}>()

const editing = ref(false)
const newValue = ref(props.modelValue)

const updateValue = () => {
  emit("update:modelValue", newValue.value)
  editing.value = false
}

const cancelUpdate = () => {
  newValue.value = props.modelValue
  editing.value = false
}
</script>

<template>
  <div>
    <div v-if="editing === false">
      <div
        class="editable-label-box pb-3 flex justify-space-between align-items-center"
        :class="{ 'editable-label-error': error }">
        <div class="pl-2 text-box">
          <label class="fs-label" :class="[error ? 'text-error' : 'text-on-surface-variant']">{{
            title
          }}</label>
          <div class="fw-normal mt-2 text-on-background">
            {{ modelValue }}
          </div>
        </div>
        <div>
          <Icon v-if="editable" class="edit-icon" :icon="Icons.EDIT" @click="editing = true" />
          <div v-if="description" class="text-on-surface-variant fs-label">
            {{ description }}
          </div>
        </div>
      </div>
      <div v-if="note" class="mt-2" :class="[error ? 'text-error' : 'text-on-surface-variant']">
        <small>{{ note }}</small>
        <Icon
          v-if="errorIcon"
          class="ml-2 mt-1 pointer"
          :icon="errorIcon"
          @click="emit('clickErrorIcon')" />
      </div>
    </div>
    <div v-if="editing === true" class="mt-5">
      <Input
        v-model="newValue"
        :label="`*${title}`"
        is-outlined
        :variant="error ? Variant.ERROR : ''"
        @keyup.enter="updateValue" />
      <div class="flex justify-space-between">
        <div :class="[error ? 'text-error' : 'text-on-surface-variant']">
          <div v-if="note">
            <small>{{ note }}</small>
            <Icon
              v-if="errorIcon"
              class="ml-2 mt-1 pointer"
              :icon="errorIcon"
              @click="emit('clickErrorIcon')" />
          </div>
        </div>
        <div class="flex button-group">
          <Button type="text" class="mr-2" @click="cancelUpdate">Cancel</Button>
          <Button type="filled" @click="updateValue">Done</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editable-label-box {
  border-bottom: 1px solid rgba(225, 227, 223, 1);
}

.text-box {
  max-width: 90%;
}

.editable-label-error {
  border-bottom: 1px solid #ba1a1a;
}

.edit-icon {
  font-size: 1.5rem;
  cursor: pointer;
}

.button-group {
  justify-content: end;
}

:deep(.input-text-group > .input-text) {
  padding: 1rem;
}

.pointer {
  cursor: pointer;
}
</style>
