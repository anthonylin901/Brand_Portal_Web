<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>
<template>
  <button :class="['hy-anchor', { active: active }]">
    <slot />
  </button>
</template>
<style scoped>
.hy-anchor {
  color: #191c1a;
  border: none;
  background-color: transparent;
  opacity: 0.68;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  padding: 10px 24px;
  display: block;
  min-width: 212px;
  text-align: left;
  box-shadow: 3px 0 0 rgba(64, 73, 68, 0.16) inset;
  cursor: pointer;
}

.hy-anchor.active {
  opacity: 1;
  color: #006c4d;
  box-shadow: 3px 0 0 #006c4d inset;
}
</style>
