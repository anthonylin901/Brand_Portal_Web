<script setup lang="ts">
import { Drawer, NoData } from "hyena-design-system"
import { ErrorCode } from "hyena-brand-portal-api-client"
import NoDataSmileImg from "@/assets/images/no_data_smile_image.svg"
import NoDataImg from "@/assets/images/no_data_porker_face_image.svg"
import { useInstructionStore } from "@/stores/use-instruction-store"
import { formatDate } from "@/utils/formatter"

defineProps<{
  isShow: boolean
  errorCodeList: ErrorCode[]
  lastConnectTime?: string
}>()

const emit = defineEmits<{
  (event: "close-drawer"): void
}>()

const instructionStore = useInstructionStore()

const getErrorCodeDescription = (errorCode: number) => {
  const instruction = instructionStore.instruction.find(item => {
    return item.id === +errorCode
  })
  return instruction
    ? `${errorCode} | ${instruction.category} ${instruction.error_type}`
    : `${errorCode} | unknown`
}
</script>

<template>
  <Drawer
    title="Error Codes Recorded in HMI"
    :is-show="isShow"
    is-footer-button-hide
    is-cancel-skip-confirmation
    @close-drawer="emit('close-drawer')">
    <p class="intro p-0 m-0">
      <span v-if="errorCodeList.length > 0">
        For additional reference, you can check Error Codes stored independently in the HMI here,
        including errors that occur even when not connected to the Hyena software (DP, HST, HRA).
      </span>
      <span v-else>
        Check the error codes recorded in the HMI here, including those occurred while offline.
      </span>
    </p>
    <template v-if="errorCodeList.length > 0">
      <p class="error-code-record my-4">Stores up to {{ errorCodeList.length }} entries</p>
      <ul class="error-code-list">
        <li v-for="item in errorCodeList" :key="item.odo" class="error-code-item pl-3 pr-4">
          <p class="error-code-distance mb-1 mt-0">{{ item.odo }} km</p>
          <p class="error-code-title my-0">{{ getErrorCodeDescription(item.id) }}</p>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="no-data-wrapper">
        <div v-if="lastConnectTime">
          <NoData message="No error codes" :img-src="NoDataSmileImg" />
          <h3 class="text-title-medium ta-center">No error codes were found in HMI records</h3>
          <p class="text-title-medium ta-center">Latest checked: {{formatDate(lastConnectTime, "D MMM, YYYY")}} in DP</p>
          <p class="mt-4 mb-0">
            *If this e-bike recently had its HMI replaced, past HMI error records are no longer available.
          </p>
        </div>
        <div v-else>
          <NoData message="Records not available" :img-src="NoDataImg" />
          <h3 class="text-title-medium ta-center">To check for any stored error codes in HMI, please<br /> connect the bike to Dealer Portal first</h3>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<style lang="scss" scoped>
:deep(.el-drawer__header span) {
  font-weight: 700;
  color: #191c1a;
}

:deep(.el-drawer__header .icon-close::before),
:deep(.el-drawer__header .hy-icon:hover) {
  color: #191c1a;
}

:deep(.el-drawer) {
  min-width: 640px;
}

:deep(.el-drawer__body) {
  padding: 24px;
}

.intro {
  font-weight: 500;
  line-height: 24px;
  color: #404944;
}

.error-code {
  &-record {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #404944;
  }

  &-item {
    border-bottom: 1px solid #e1e3df;
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
  }

  &-distance {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: #404944;
  }

  &-title {
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.08px;
    color: #191c1a;
  }
}

.no-data-wrapper {
  margin: 32px auto;
  padding: 32px;
  border-top: 1px solid #e1e3df;
  color: #404944;
  :deep(.hy-no-data-text) {
    color: #404944;
  }
  h3 {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }
  p {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  .hy-icon {
    font-size: 20px;
  }
}

:deep(.hy-no-data-box .hy-no-data-image) {
  width: 7.5rem;
}
</style>
