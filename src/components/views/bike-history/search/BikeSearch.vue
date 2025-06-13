<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import BikeHistorySearchBar from "@/components/blocks/bike-history/BikeHistorySearchBar.vue"
import { FormList, NoData, useLoading } from "hyena-design-system"
import { Routes } from "@/types/enums"
import { setBikeInfo } from "@/utils/bike-detail"
import { errorAlert, successAlert } from "@/utils/alert"

const searchErrorMessage = "Bike not found, please search another bike Frame Number."
const router = useRouter()
const { start } = useLoading()

const emit = defineEmits<{
  (e: "searched"): void
}>()

const isBikeNotFound = ref(false)

const searchBikeInfo = async (frameNumber: string) => {
  isBikeNotFound.value = false
  const stop = start("Searching Bike Information...")
  try {
    await setBikeInfo(frameNumber)
    router.push({ name: Routes.BikeHistoryDetail })
    successAlert("Bike found successfully.")
  } catch{
    isBikeNotFound.value = true
    errorAlert("Bike not found, please search another Frame Number")
  } finally {
    stop()
  }
}
</script>
<template>
  <div class="mt-5">
    <div class="hy-form-group bike-not-found">
      <div class="search-input-title mb-2">Search Frame Number</div>
      <div class="search-input-des mb-3">Please search Frame Number to get history.</div>
      <FormList
        :is-error="isBikeNotFound"
        :note="isBikeNotFound ? searchErrorMessage : ''">
        <BikeHistorySearchBar is-show-label :is-error="isBikeNotFound" class="bike-search-bar" @search-frame-number="searchBikeInfo" />
      </FormList>
      <NoData v-if="isBikeNotFound" :message="'No Data'" class="mt-3" />
      <img v-else class="ride-front-view" src="@/assets/images/ride_front_view.svg" />
    </div>
  </div>
</template>

<style scoped>
:deep(.form-list-note) {
  float: left;
  margin-top: -10px;
  margin-left: 10px;
}
.bike-not-found {
  text-align: center;
  max-width: 35%;
  margin: 150px auto;
  padding: 2rem;
}
.search-input-title {
  font-size: 1.25rem;
  font-weight: 700;
}
.search-input-des {
  font-size: 1rem;
}
.ride-front-view {
  width: 25rem;
}
.bike-search-bar {
  margin: 0 auto;
}
</style>
