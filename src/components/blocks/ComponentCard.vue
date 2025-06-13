<script setup lang="ts">
import { ComponentCardData } from "@/types/common"
import { Icon, Icons, Tooltip } from "hyena-design-system"
import { computed } from "vue"
import { capitalize, transformPartLabelName } from "@/utils/formatter"

const props = defineProps<{
  data: ComponentCardData
}>()

const isNoInfo = computed(() => !props.data.marketingName && !props.data.infoList)
const getSparePartContent = (partType: string, sparePartAmount: number) => {
  return `This bike model has ${sparePartAmount} spare ${capitalize(
    transformPartLabelName(partType)
  )} options. You can choose either one and install it on the bike.`
}
</script>

<template>
  <div class="component-card px-2">
    <div class="component-card-img">
      <img :src="data.img" alt="No Image" />
      <p
        class="component-card-img-status"
        :class="[data.statusInfo.isCommunication ? 'communication' : 'non-communication']"
      >
        {{ data.statusInfo.isCommunication ? "Communication" : "Non-Communication" }}
      </p>
    </div>
    <div class="component-card-content">
      <div class="component-card-topic mb-1">
        <p class="component-card-title">
          {{ capitalize(transformPartLabelName(data.partType)) }}
        </p>
        <p v-if="data.sparePartInfo" class="component-card-supplement">
          {{ `Spare ${data.sparePartInfo.sparePartIndex}` }}
          <Tooltip
            placement="bottom-left"
            :content="
              getSparePartContent(data.partType, data.sparePartInfo?.sparePartAmount)
            "
          >
            <Icon :icon="Icons.HELP" />
          </Tooltip>
        </p>
      </div>
      <p v-if="data.marketingName" class="component-card-subtitle">{{ data.marketingName }}</p>
      <p v-if="data.description" class="component-card-item-label">{{ data.description }}</p>
      <ul v-if="data.infoList && data.infoList?.length > 0" class="component-card-list mt-2">
        <li v-for="item in data.infoList" :key="item.label" class="component-card-item">
          <p class="component-card-item-label">{{ item.label }}</p>
          <p class="component-card-item-value">{{ item.value }}</p>
        </li>
      </ul>
      <p v-if="isNoInfo" class="component-card-no-info">No details for this accessory</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
p {
  margin: 0;
}

.component-card {
  display: flex;

  &-img {
    position: relative;
    width: 112px;
    height: 112px;
    margin-right: 12px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #eff1ed;

    img {
      width: 72px;
      height: 72px;
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &-status {
      width: 100%;
      margin: 0;
      padding: 2px 4px;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;

      &.communication {
        background-color: #c6ebd7;
        color: #006c4d;
      }

      &.non-communication {
        background-color: #d0e0ec;
        color: #0a6aaf;
      }
    }
  }

  &-title,
  &-supplement,
  &-subtitle {
    font-weight: 700;
    letter-spacing: 0.1px;
    color: #191c1a;
  }

  &-title {
    line-height: 24px;
  }

  &-supplement,
  &-subtitle {
    font-size: 14px;
    line-height: 20px;
  }

  &-content {
    flex: 1;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;

    &:not(:last-child) {
      border-bottom: 1px solid #d2dcd6;
    }

    &-label {
      color: #404944;
    }

    &-value {
      color: #191c1a;
    }
  }

  &-no-info {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #404944;
  }
}
</style>
