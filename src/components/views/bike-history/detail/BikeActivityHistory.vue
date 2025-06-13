<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import {
  ListGroup,
  ListItem,
  NoData,
  Icon,
  Icons,
  Tooltip,
  DatePicker,
  LoadingDot,
} from "hyena-design-system"
import ActivityTipModal from "@/components/views/bike-history/detail/ActivityTipModal.vue"
import { useInstructionStore } from "@/stores/use-instruction-store"
import { useEnumerationStore } from "@/stores/use-enumeration-store"
import { getActivityName, getActivityContent, getBikeShopName, appendActivityTaskList, resetActivityTaskList, isCommentActivity } from "@/components/views/bike-history/detail/bike-detail-bo"
import { formatDate, getISODatetime } from "@/utils/formatter"
import { useBikeStore } from "@/stores/use-bike-store"
import { wait } from "@/utils/common"
import { ReportedOrganizationEnum } from "hyena-brand-portal-api-client"
import { PLATFORM_LABEL_MAP } from "@/constants/bike-detail"
import textsmsIcon from "@/assets/images/textsms-icon.png"

const MAXIMUM_RANGE_DATE = 90
const DEFAULT_PAGE_SIZE = 20

const props = defineProps<{
  frameNumber: string
}>()

const emit = defineEmits<{
  (event: "openDrawer"): void
}>()

const bikeStore = useBikeStore()
const instructionStore = useInstructionStore()
const enumerationStore = useEnumerationStore()
const page = ref(1)
const isLoading = ref(false)
const loadMoreTrigger = ref(null)
const isShowActivityModal = ref(false)
const rangeStartDate = ref<Date>()
const date = new Date()
const searchDate = ref([
  date.setDate(date.getDate() - MAXIMUM_RANGE_DATE),
  new Date().getTime(),
])
const bikeShopList = computed(() => enumerationStore.getBikeShopList)

const formatActivityTaskList = computed(() => {
  return bikeStore.activityTaskList.map((task) => {
    return {
      title: getActivityName(task.name, instructionStore.instruction, task.context, task.target),
      updatedAt: formatDate(task.updated_at, "DD MMM, YYYY HH:mm:ss"),
      note: getActivityContent(task.name, task.context, task.target),
      bikeShop: task.organization?.id && task.organization.type === ReportedOrganizationEnum.BikeShop ? getBikeShopName(task.organization?.id, bikeShopList.value) : "-",
      platform: PLATFORM_LABEL_MAP[task.platform],
      isActivityComment: isCommentActivity(task.name)
    }
  })
})

const isHasMoreData = computed(
  () =>
    formatActivityTaskList.value.length > 0 &&
    formatActivityTaskList.value.length % DEFAULT_PAGE_SIZE === 0
)

const getDateClass = (date: Date) => {
  if (rangeStartDate.value) {
    const singleDate = new Date(date)
    const startDate = new Date(rangeStartDate.value)
    const daysBefore = new Date(startDate)
    const daysAfter = new Date(startDate)
    daysBefore.setDate(startDate.getDate() - MAXIMUM_RANGE_DATE)
    daysAfter.setDate(startDate.getDate() + MAXIMUM_RANGE_DATE)
    return singleDate < daysBefore || singleDate > daysAfter ? "disable-date" : ""
  }
  return ""
}

const setRangeStartDate = (date: Date) => {
  rangeStartDate.value = date
}

const setRangeEndDate = () => {
  rangeStartDate.value = undefined
}

const setLoadMoreTrigger = () => {
  const observer = new IntersectionObserver(async (entries) => {
    if (isHasMoreData.value && entries[0].isIntersecting && !isLoading.value) {
      ++page.value
      await updateActivityTaskList(page.value)
    }
  })
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
}

const searchActivityTask = async (activityRangeDate: number[]) => {
  page.value = 1
  searchDate.value = activityRangeDate
  resetActivityTaskList()
  await updateActivityTaskList(page.value)
}

const updateActivityTaskList = async (currentPage: number) => {
  isLoading.value = true
  try {
    const startDate = new Date((new Date(searchDate.value[0]).setHours(0, 0, 0, 0)))
    const endDate = new Date((new Date(searchDate.value[1] ?? searchDate.value[0]).setHours(23, 59, 59, 999)))
    await wait(1)
    await appendActivityTaskList(
      props.frameNumber,
      getISODatetime(startDate).replace("T", " "),
      getISODatetime(endDate).replace("T", " "),
      currentPage,
      DEFAULT_PAGE_SIZE
    )
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  setLoadMoreTrigger()
  await searchActivityTask(searchDate.value)
})
</script>

<template>
  <div>
    <h3 class="title mb-3 mt-4 pt-3 flex align-items-center">
      Activity History
      <DatePicker
        v-model="searchDate"
        class="activity-date-picker ml-2"
        range
        :partial-range="true"
        :max-range="MAXIMUM_RANGE_DATE"
        :min-range="1"
        :default-date="searchDate"
        :get-date-class="getDateClass"
        @update-date="(value) => searchActivityTask(value)"
        @selectRangeStartDate="setRangeStartDate"
        @selectRangeEndDate="setRangeEndDate"
      />
    </h3>
    <p class="fw-semi-bold description mb-3 mt-0">
      Activities while e-bike connected to the Hyena software (DP, HST, HRA).
    </p>
    <p class="fw-normal description error-code-note mt-0 mb-3">
      *For error codes, you can check additional info on
      <a @click="emit('openDrawer')">error codes recorded in the HMI</a>.
    </p>
    <ListGroup class="activity-history-table">
      <ListItem is-header>
        <div class="col-4 fw-bold">Activity</div>
        <div class="col-5 fw-bold flex align-items-center">
          Note
          <p class="tip m-0 pl-2">
            Dealer-Selected activity
            <Icon class="ml-1" :icon="Icons.HELP" @click="isShowActivityModal = true" />
          </p>
        </div>
        <div class="col-2 fw-bold">
          Bike Shop
          <Tooltip
            placement="bottom-right"
            content="The bike shop information is exclusive to the Dealer Portal and is not available on other software platforms."
          >
            <Icon :icon="Icons.HELP" />
          </Tooltip>
        </div>
        <div class="col-1 fw-bold">Platform</div>
      </ListItem>
      <template v-if="formatActivityTaskList.length || isLoading">
      <TransitionGroup name="slide-fade">
        <ListItem
          v-for="(item, index) in formatActivityTaskList"
          :key="`${item.title} ${index}`"
          :no-divider="index === formatActivityTaskList.length - 1"
          class="activity-history-item"
        >
          <div class="col-4 activity-title">
            <div class="activity-title-time">{{ item.updatedAt }}</div> <div class="mx-3 break-word activity-title-name">{{ item.title }}</div>
          </div>
          <div class="col-5 flex">
            <img class="textsms-icon mr-2" v-if="item.isActivityComment" :src="textsmsIcon" />{{ item.note }}
          </div>
          <div class="col-2">
            {{ item.bikeShop }}
          </div>
          <div class="col-1">
            {{ item.platform }}
          </div>
        </ListItem>
      </TransitionGroup>
        <ListItem v-if="!isHasMoreData || isLoading" class="data-status-note">
          <div v-if="isLoading" class="note flex items-center">
            Loading more <LoadingDot class="ml-1 mt-2" color="#000" />
          </div>
          <span v-else-if="!isHasMoreData" class="note">You've reached the bottom.</span>
        </ListItem>
      </template>
      <NoData
        v-else
        class="py-4"
        message="No data available for this range. Please try searching another time period"
      />
    </ListGroup>
    <div ref="loadMoreTrigger"></div>
    <ActivityTipModal v-if="isShowActivityModal" @close="isShowActivityModal = false" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.hy-list-item),
.activity-history-item {
  color: #191c1a;
}

.activity-title {
  display: flex;
  &-time {
    width: 160px;
  }
  &-name {
    width: 300px;
  }
}

.data-status-note {
  position: relative;
  height: 50px;
  .note {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #404944;
    font-weight: 600;
    font-size: 14px;
  }
}

.error-code-note {
  color: #404944;
}

.activity-history-item {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.035px;
}

.tip {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

a {
  text-decoration: underline;
  color: #006c4d;
  cursor: pointer;
}

.textsms-icon {
  width: 18px;
  height: 18px;
}

:deep(.hy-icon) {
  cursor: pointer;
}

.activity-date-picker {
  :deep(.dp__input_wrap .dp__input) {
    height: auto;
    padding: 10px 44px 10px 16px;
    border-radius: 22px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.1px;
    background: rgba(0, 108, 77, 0.16);
    color: #191c1a;
  }

  :deep(.date-picker-icon) {
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    color: #191c1a;
  }

  :deep(.dp__action_row) {
    position: relative;

    &::before {
      content: "Select up to 3 months";
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      color: #404944;
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  :deep(.dp__calendar_item) {
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  :deep(.dp__calendar_item:has(.dp__range_end)) {
    background: linear-gradient(to right, #c6ebd7 60%, transparent 40%);
  }
  :deep(.dp__calendar_item:has(.dp__range_start)) {
    background: linear-gradient(to left, #c6ebd7 60%, transparent 40%);
  }
}

:deep(.hy-no-data-box .hy-no-data-image) {
  width: 7.5rem;
}

:deep(.hy-loading-dot) {
  width: 0.25rem;
  height: 0.25rem;
}
</style>
<style lang="scss">
.activity-date-picker {
  .disable-date {
    color: #c0c4cc !important;
    cursor: not-allowed;
  }
}
</style>
