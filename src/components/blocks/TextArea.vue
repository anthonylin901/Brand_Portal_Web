<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  fieldName: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  rows: {
    type: Number,
    default: 20,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  invalidText: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["update:modelValue"])

const value = computed({
  get: () => props.modelValue,
  set: val => {
    emit("update:modelValue", val)
  },
})
</script>

<template>
  <div class="textarea-wrapper">
    <label class="textarea-label" :class="{ 'textarea-invalid-text': invalid }">{{
      fieldName
    }}</label>
    <textarea
      v-model="value"
      :placeholder="placeholder"
      :rows="rows"
      class="textarea-input"
      :class="{ 'textarea-input-invalid': invalid }" />
    <div v-if="invalid" class="textarea-invalid-text">{{ invalidText }}</div>
  </div>
</template>

<style scoped>
.textarea-wrapper {
  position: relative;
}

.textarea-label {
  font-weight: 500;
  position: absolute;
  top: -10px;
  left: 10px;
  background-color: white;
  padding: 0 5px;
  font-size: 14px;
  color: #333;
}

.textarea-input {
  width: 100%;
  padding: 16px;
  border: 1px solid #707973;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  resize: none;
  font-weight: 500;
}

.textarea-input-invalid {
  border: 1px solid #ba1a1a;
}

.textarea-input:focus {
  outline: none;
}

.textarea-input::placeholder {
  color: #191c1a;
  opacity: 0.38;
  font-weight: 500;
}

.textarea-invalid-text {
  color: #ba1a1a;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}
</style>
