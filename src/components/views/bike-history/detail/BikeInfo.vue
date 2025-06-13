<script setup lang="ts">
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { Icons, Icon } from "hyena-design-system"
import { BikeInformation } from "hyena-brand-portal-api-client"
import { formatDate } from "@/utils/formatter"
import { Routes } from "@/types/enums"

enum INFO_LABEL {
  BIKE_MODEL = "Bike Model",
  PRODUCTION_DATE = "Production Date",
  PRODUCED_BY = "Produced by",
  POST_BUNDLE_BY = "Post-bundle by",
  ACTIVATION_DATE = "Activation Date",
}

const props = defineProps<{
  bikeInfoData: BikeInformation
}>()
const FORMATTED_DATE_RULE = "MMM D, YYYY"

const bikeInfoList = computed(() => [
  {
    label: INFO_LABEL.BIKE_MODEL,
    value: props.bikeInfoData.model.name,
  },
  {
    label: INFO_LABEL.PRODUCTION_DATE,
    value: formatDate(props.bikeInfoData.assembled_at, FORMATTED_DATE_RULE),
  },
  {
    label: props.bikeInfoData.assembly_factory.is_post_bundle ? INFO_LABEL.POST_BUNDLE_BY : INFO_LABEL.PRODUCED_BY,
    value: props.bikeInfoData.assembly_factory.name,
  },
  {
    label: INFO_LABEL.ACTIVATION_DATE,
    value: props.bikeInfoData.registered_at
      ? formatDate(props.bikeInfoData.registered_at, FORMATTED_DATE_RULE)
      : "Not activated",
    isWarning: !props.bikeInfoData.registered_at,
  },
])
</script>

<template>
  <div class="bike-model-info flex align-items-center py-2">
    <div class="bike-model-info-img mr-2">
      <img :src="bikeInfoData.model.image_url" alt="No Picture" />
    </div>
    <div class="bike-model-info-wrapper flex">
      <div
        v-for="item in bikeInfoList"
        :key="item.label"
        class="bike-model-info-item px-4"
      >
        <div class="bike-model-info-label mb-1">{{ item.label }}</div>
        <div
          class="bike-model-info-value"
          :class="[{ 'bike-model-info-name': item.label === INFO_LABEL.BIKE_MODEL }]"
          :style="{ color: item.isWarning ? '#dd650c' : '' }"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
    <RouterLink :to="{ name: Routes.BikeHistoryComponentInfo }">
      Component Info <Icon :icon="Icons.NAVIGATE_NEXT" class="ml-2" />
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.bike-model-info {
  padding-left: 32px;
  padding-right: 32px;
  background-color: #fff;
  border-top: 1px solid #dbe5df;
  border-bottom: 1px solid #dbe5df;

  &-img {
    width: 96px;
    height: 72px;
    position: relative;

    img {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &-name {
    max-width: 20rem;
  }

  &-item {
    padding-top: 14px;
    padding-bottom: 14px;
  }

  &-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: #404944;
  }

  &-value {
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.08px;
    color: #191c1a;
  }
}

a {
  padding: 10px 12px 10px 16px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  text-decoration: none;
  color: #191c1a;
  transition: all 0.3s ease;

  .hy-icon {
    font-size: 18px;
  }

  &:hover {
    background: rgba(0, 108, 77, 0.08);
  }
}
</style>
