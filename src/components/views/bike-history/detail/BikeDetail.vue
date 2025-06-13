<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useLoading } from "hyena-design-system"
import BikeInfo from "@/components/views/bike-history/detail/BikeInfo.vue"
import BikeUnresolvedTask from "@/components/views/bike-history/detail/BikeUnresolvedTask.vue"
import BikeActivityHistory from "@/components/views/bike-history/detail/BikeActivityHistory.vue"
import ErrorCodesDrawer from "@/components/views/bike-history/detail/ErrorCodesDrawer.vue"
import useDrawer from "@/composables/useDrawer"
import { useBikeStore } from "@/stores/use-bike-store"
import { storage } from "@/utils/local-storage"
import {
  setBikeInfo,
  initBikeShopList,
  initPartSpecList,
  setUnresolvedTaskList,
} from "@/utils/bike-detail"

const { start } = useLoading()
const bikeStore = useBikeStore()
const { isShow, close, active } = useDrawer()


const initBikeInfo = async () => {
  const storageFrameNumber = storage.getFrameNumber()
  const cachedFrameNumber = bikeStore.currentBikeInfoData?.vin
  await Promise.all([initBikeShopList(), initPartSpecList()])
  if (storageFrameNumber && storageFrameNumber !== cachedFrameNumber) {
    await setBikeInfo(storageFrameNumber)
  }
  if (storageFrameNumber) {
    await setUnresolvedTaskList(storageFrameNumber)
  }
}

onMounted(async () => {
  const stop = start("Getting Bike Information...")
  try {
    await initBikeInfo()
  } finally {
    stop()
  }
})
</script>

<template>
  <div class="bike-history-detail">
    <BikeInfo
      v-if="bikeStore.currentBikeInfoData"
      :key="bikeStore.currentBikeInfoData.id"
      :bike-info-data="bikeStore.currentBikeInfoData"
    />
    <div class="bike-history-detail-wrapper py-4">
      <BikeUnresolvedTask :unresolved-task-list="bikeStore.unresolvedTaskList" />
      <Transition name="fade">
        <BikeActivityHistory
          v-if="bikeStore.currentBikeInfoData?.vin"
          :key="bikeStore.currentBikeInfoData?.vin"
          :frame-number="bikeStore.currentBikeInfoData?.vin"
          @open-drawer="active"
        />
      </Transition>
    </div>
    <ErrorCodesDrawer
      :error-code-list="bikeStore.getHmiErrorCodeList"
      :last-connect-time="bikeStore.currentBikeInfoData?.error_code_in_hmi?.reported_at"
      :is-show="isShow"
      @close-drawer="close"
    />
  </div>
</template>
<style lang="scss">
.bike-history-detail {
  min-width: 1200px;
  min-height: 100vh;
  background-color: #fff;

  &-wrapper {
    padding-left: 32px;
    padding-right: 32px;
  }

  // 子層 title
  .title {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    color: #191c1a;
  }
  // 子層 description
  .description {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.035px;
    color: #191c1a;
  }
}

:deep(.hy-list-item.header) {
  border: none;
}

:deep(.hy-list-item:nth-child(2)) {
  border-left: none;
  border-right: none;
}
</style>
