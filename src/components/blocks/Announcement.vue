<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <p class="announcement m-0 py-3">{{ text }}</p>
</template>

<style lang="scss" scoped>
.announcement {
  padding-left: 32px;
  padding-right: 32px;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  background-color: #eff1ed;
  color: #191c1a;
}
</style>
