<script setup lang="ts">
import Announcement from "@/components/blocks/Announcement.vue"
import ComponentCard from "@/components/blocks/ComponentCard.vue"
import { ComponentCardData } from "@/types/common"
import { NoData } from "hyena-design-system"
import NoDataImg from "@/assets/images/no_data_porker_face_image.svg"

defineProps<{
  announcement: string
  controlAndDisplayUnitList: ComponentCardData[]
  powerSupplyList: ComponentCardData[]
  driveUnitList: ComponentCardData[]
  accessoryList: ComponentCardData[]
}>()

const isShowDivide = (index: number, length: number) => {
  return index !== length - 1
}
</script>

<template>
  <Announcement :text="announcement" />
  <div class="info-wrapper">
    <div class="info-col">
      <div>
        <p class="info-title">Control and display unit</p>
        <template v-if="controlAndDisplayUnitList.length > 0">
          <div v-for="(data, index) in controlAndDisplayUnitList" :key="data.id">
            <ComponentCard :data="data" />
            <hr v-if="isShowDivide(index, controlAndDisplayUnitList.length)">
          </div>
        </template>
        <NoData v-else class="p-2" :img-src="NoDataImg" message="No Data" />
      </div>
      <hr>
      <div>
        <p class="info-title">Power supply</p>
        <template v-if="powerSupplyList.length > 0">
          <div v-for="(data, index) in powerSupplyList" :key="data.id">
            <ComponentCard :data="data" />
            <hr v-if="isShowDivide(index, powerSupplyList.length)">
          </div>
        </template>
        <NoData v-else class="p-2" :img-src="NoDataImg" message="No Data"  />
      </div>
    </div>
    <div class="info-col">
      <div>
        <p class="info-title">Drive unit</p>
        <template v-if="driveUnitList.length > 0">
          <div v-for="(data, index) in driveUnitList" :key="data.id">
            <ComponentCard :data="data" />
            <hr v-if="isShowDivide(index, driveUnitList.length)">
          </div>
        </template>
        <NoData v-else class="p-2" :img-src="NoDataImg" message="No Data"  />
      </div>
    </div>
    <div class="info-col">
      <div>
        <p class="info-title">Accessory</p>
        <template v-if="accessoryList.length > 0">
          <div v-for="(data, index) in accessoryList" :key="data.id">
            <ComponentCard :data="data" />
            <hr v-if="isShowDivide(index, accessoryList.length)">
          </div>
        </template>
        <NoData v-else class="p-2" :img-src="NoDataImg" message="No Data"  />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  min-height: calc(100vh - 106px - 51px - 62px); // 106px: header, 51px: tab, 62px: announcement
}

.info-col {
  padding: 12px;
  position: relative;

  &:not(:last-child) {
    border-right: 1px solid #d9dbe0;
  }

  &:nth-child(1) {
    z-index: 3;
  }

  &:nth-child(2) {
    z-index: 2;
  }
}

.info-title {
  margin: 0;
  padding: 8px 12px;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  color: #1b1b1b;
}

:deep(.hy-no-data-box) {
  width: 100px;
  text-align: center;

  .hy-no-data-image {
    width: 80px;
    margin: 0 auto;
  }

  .hy-no-data-text {
    text-align: left;
  }
}

hr {
  border-top: 1px solid #d2dcd6;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}
</style>
