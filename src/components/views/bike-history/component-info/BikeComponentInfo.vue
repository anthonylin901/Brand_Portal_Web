<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useLoading, Tabs, TabPane } from "hyena-design-system"
import ComponentInfoDashboard from "@/components/views/bike-history/component-info/ComponentInfoDashboard.vue"
import { getComponentInfo } from "@/components/views/bike-history/component-info/bike-component-info-bo"
import useComponentInfo from "@/components/views/bike-history/component-info/use-component-info"
import { setBikeInfo, initBikeShopList, initPartSpecList } from "@/utils/bike-detail"
import { ComponentInfo } from "@/types/bike-history"
import { storage } from "@/utils/local-storage"
import { Routes } from "@/types/enums"
import { bikeStore } from "@/stores"

enum TAB_NAME {
  CURRENT_BUNDLE = "Current Bundle",
  BIKE_MODEL_SPEC = "Bike Model Spec",
  PRODUCTION_BUNDLE = "Production Bundle",
}

const tabList = [
  {label: TAB_NAME.CURRENT_BUNDLE, name: TAB_NAME.CURRENT_BUNDLE},
  {label: TAB_NAME.BIKE_MODEL_SPEC, name: TAB_NAME.BIKE_MODEL_SPEC},
  {label: TAB_NAME.PRODUCTION_BUNDLE, name: TAB_NAME.PRODUCTION_BUNDLE},
]

const router = useRouter()
const { start } = useLoading()
const activeTabName = ref(TAB_NAME.CURRENT_BUNDLE)
const currentBundlePartList = ref<ComponentInfo[]>([])
const bikeModelSpecPartList = ref<ComponentInfo[]>([])
const productionBundlePartList = ref<ComponentInfo[]>([])
const currentAnnouncement = computed(() => {
  switch (activeTabName.value) {
    case TAB_NAME.CURRENT_BUNDLE:
      return "Here are components currently bundled to the e-bike."
    case TAB_NAME.BIKE_MODEL_SPEC:
      return `Compatible components to install on bike model "${bikeStore.currentBikeInfoData?.model.name}".`
    case TAB_NAME.PRODUCTION_BUNDLE:
      return "Components bundled to the e-bike at initial production."
    default:
      return ""
  }
})
const currentComponentList = computed(() => {
  switch (activeTabName.value) {
    case TAB_NAME.CURRENT_BUNDLE:
      return currentBundlePartList.value
    case TAB_NAME.BIKE_MODEL_SPEC:
      return bikeModelSpecPartList.value
    case TAB_NAME.PRODUCTION_BUNDLE:
      return productionBundlePartList.value
    default:
      return []
  }
})

const {
  controlAndDisplayUnitList,
  powerSupplyList,
  driveUnitList,
  accessoryList,
} = useComponentInfo(currentComponentList)

const initBikeInfo = async () => {
  const storageFrameNumber = storage.getFrameNumber()
  if(!storageFrameNumber) {
    router.push({name: Routes.BikeHistorySearch})
    return
  }
  const cachedFrameNumber = bikeStore.currentBikeInfoData?.vin
  if (storageFrameNumber && storageFrameNumber !== cachedFrameNumber) {
    await Promise.all([initBikeShopList(), initPartSpecList()])
    await setBikeInfo(storageFrameNumber)
  }
  setPartInfo()
}

const setPartInfo = () => {
  const {currentBundleList, bikeModelSpecList, productionBundleList } = getComponentInfo()
  currentBundlePartList.value = currentBundleList
  bikeModelSpecPartList.value = bikeModelSpecList
  productionBundlePartList.value = productionBundleList
}

onMounted(async () => {
  const stop = start(true)
  try {
    await initBikeInfo()
  } finally {
    stop()
  }
})
</script>

<template>
  <div class="wrapper">
    <Tabs v-model="activeTabName">
      <TabPane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name" />
    </Tabs>
    <ComponentInfoDashboard
      :announcement="currentAnnouncement"
      :control-and-display-unit-list="controlAndDisplayUnitList"
      :power-supply-list="powerSupplyList"
      :drive-unit-list="driveUnitList"
      :accessory-list="accessoryList" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  background: #fff;
  min-width: 1200px;
}
:deep(.el-tabs__nav .el-tabs__active-bar) {
  height: 4px;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap) {
  padding-left: 32px;
  padding-right: 32px;

  &::before,
  &::after {
    background-color: #d2dcd6;
  }

  &::before {
    content: "";
    width: 100%;
    height: 1px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .el-tabs__active-bar {
    background-color: #006c4d;
  }

  .el-tabs__item {
    height: auto;
    padding: 16px 12px !important;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.1px;
    color: #404944;

    &.is-active {
      color: #006c4d;
    }
  }
}
</style>
