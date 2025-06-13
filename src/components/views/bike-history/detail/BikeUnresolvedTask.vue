<script setup lang="ts">
import { computed } from "vue"
import { ListGroup, ListItem, NoData } from "hyena-design-system"
import { Icon, Icons } from "hyena-design-system"
import NoDataSmileImg from "@/assets/images/no_data_smile_image.svg"
import { UnresolvedTaskHistory } from "hyena-brand-portal-api-client"
import { useInstructionStore } from "@/stores/use-instruction-store"
import { useEnumerationStore } from "@/stores/use-enumeration-store"
import { getTaskName, getBikeShopName } from "@/components/views/bike-history/detail/bike-detail-bo"
import { formatDate } from "@/utils/formatter"

const props = defineProps<{
  unresolvedTaskList: UnresolvedTaskHistory[]
}>()

const instructionStore = useInstructionStore()
const enumerationStore = useEnumerationStore()
const bikeShopList = computed(()=> enumerationStore.getBikeShopList)

const formatUnresolvedTaskList = computed(() => {
  return props.unresolvedTaskList.map((task: any) => {
    return {
      title: getTaskName(task.rule_name, task.target, instructionStore.instruction),
      bikeShop: getBikeShopName(task.bike_shop_id, bikeShopList.value),
      detectedAt: formatDate(task.detected_at, "DD MMM, YYYY HH:mm:ss"),
    }
  })
})
</script>

<template>
  <div>
    <h3 class="title mb-2 mt-0">Unresolved Task</h3>
    <Transition name="slide-fade">
    <p
      v-if="formatUnresolvedTaskList.length > 0"
      class="description text-warning fw-semi-bold my-0"
    >
      <Icon :icon="Icons.WARNING_FILLED" class="mr-1" />
      This e-bike has unresolved task in Dealer Portal that require further attention.
    </p>
    <p v-else class="description fw-semi-bold my-0">
      Unresolved tasks in the Dealer Portal.
    </p>
    </Transition>
    <ListGroup class="unresolved-task-table">
      <ListItem is-header>
        <div class="col-5 fw-semi-bold">Unresolved Task</div>
        <div class="col-3 fw-semi-bold">Latest Detected Time</div>
        <div class="col fw-semi-bold">Latest Detected Bike Shop</div>
      </ListItem>
      <TransitionGroup name="slide-fade">
      <template v-if="formatUnresolvedTaskList.length > 0">
        <ListItem
          v-for="(item, index) in formatUnresolvedTaskList"
          :key="`${item.title}-${index}`"
          :no-divider="index === unresolvedTaskList.length - 1"
          class="unresolved-task-item"
        >
          <div class="col-5 break-word">
            {{ item.title }}
          </div>
          <div class="col-3 break-word fs-label">
            {{ item.detectedAt }}
          </div>
          <div class="col break-word fs-label">
            {{ item.bikeShop }}
          </div>
        </ListItem>
      </template>
      <NoData
        v-else
        class="py-4"
        :img-src="NoDataSmileImg"
        message="Great! This bike currently has no unresolved issues in the Dealer Portal"
      />
    </TransitionGroup>

    </ListGroup>
  </div>
</template>

<style scoped lang="scss">
.text-warning {
  color: #dd650c !important;
}

.unresolved-task-table {
  overflow: hidden;
}

:deep(.hy-list-item),
.unresolved-task-item {
  color: #191c1a;
}

.unresolved-task-item {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.035px;
}

:deep(.hy-no-data-box .hy-no-data-image) {
  width: 7.5rem;
}

</style>
