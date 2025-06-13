<script setup lang="ts">
const props = defineProps<{
  params: {
    dataList: string[]
  }
}>()

const showComma = (index: number) => {
  return index !== props.params.dataList.length - 1
}
</script>

<template>
  <div class="data-list-box">
    <div v-if="params.dataList.length === 0">N/A</div>
    <div v-for="(brand, index) in params.dataList" :key="`${brand}${index}`" class="mr-1">
      {{ brand }}<span v-if="showComma(index)">,</span>
    </div>
  </div>
</template>
