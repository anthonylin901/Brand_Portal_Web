<script setup lang="ts">
import Modal from "@/components/blocks/Modal.vue"
import ServiceToolActivityImg from "@/assets/images/service-tool-activity.png"
import ServiceReportActivityImg from "@/assets/images/service-report-activity-comment.png"

const emit = defineEmits<{
  (event: "close"): void
}>()

</script>

<template>
  <Modal
    class="activity-modal"
    :is-show-modal="true"
    title="Dealer-Selected activity"
    @close="emit('close')"
  >
    <p class="mt-0 mb-4">
      This is information entered by the dealer in the Service Tool, including details selected in the Task-Completed prompt and the Service Report.
    </p>
    <img :src="ServiceToolActivityImg" alt="Dealer-Selected activity description" />
    <p class="mt-2 mb-4">
      Dealer-selected activity in the Task Completed prompt
    </p>
    <img :src="ServiceReportActivityImg" alt="Dealer-Selected comment description" />
    <p class="mb-0 mt-2">Dealer-selected activity in the Service Report</p>
  </Modal>
</template>

<style lang="scss" scoped>

.activity-modal {
  p {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #404944;
    word-break: break-word;
  }
}

:deep(.hy-no-data-box .hy-no-data-image) {
  width: 7.5rem;
}
</style>
