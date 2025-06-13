<script setup lang="ts">
import { ElDialog } from "element-plus"

withDefaults(
  defineProps<{
    isShowModal: boolean
    isShowClose?: boolean
    width?: number
    title: string
  }>(),
  {
    isShowClose: true,
    width: 480,
  }
)
const emit = defineEmits<{
  (event: "close"): void
}>()
</script>

<template>
  <ElDialog
    :class="['custom-modal', { 'is-show-footer': $slots.footer }]"
    :model-value="isShowModal"
    :width="width"
    :title="title"
    :show-close="isShowClose"
    @close="emit('close')">
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<style lang="scss">
.custom-modal {
  border-radius: 16px;

  &:not(.is-show-footer) {
    .el-dialog__footer {
      padding: 0;
    }
  }

  .el-dialog__header {
    margin-right: 0;
    padding: 24px;
    border-bottom: 1px solid #d2dcd6;
  }

  .el-dialog__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }

  .el-dialog__headerbtn {
    width: auto;
    height: auto;
    font-size: 24px;
    top: 24px;
    right: 24px;

    .el-dialog__close {
      color: #191c1a;
    }
  }

  .el-dialog__body {
    padding: 24px;
  }
}
</style>
