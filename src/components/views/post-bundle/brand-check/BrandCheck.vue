<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  FormGroup,
  Icons,
  Button,
  Dialog,
  useLoading,
  Alert,
  Select,
  Option,
} from "hyena-design-system"
import {
  updateDealerSupportHubBrand,
  getUserBrandList,
  getAllBrandIdList,
} from "@/components/views/post-bundle/brand-check/brand-check"
import { Routes } from "@/types/enums"
import {
  getPostBundleByVerifyCode,
  getCurrentBrandIdList,
} from "@/components/views/post-bundle/post-bundle"
import { errorAlert } from "@/utils/alert"
import { getApiErrorMessage, ApiFunctionName } from "@/errors/api-errors"

const router = useRouter()
const route = useRoute()
const { start } = useLoading()
const verifyCode = route.params.verifyCode as string
const acceptDialog = ref(false)
const informDialog = ref(false)
const dealerSupportHubId = ref<number>(0)
const bikeModel = ref<string>("-")
const frameNumber = ref<string>("-")
const userBrandList = ref<Option[]>([])
const currentBrandId = ref<number>(0)
const currentBrandIdList = getCurrentBrandIdList()

const setPostBundleInfo = async () => {
  const result = await getPostBundleByVerifyCode(verifyCode)
  dealerSupportHubId.value = result.dealer_support_hub_id
  frameNumber.value = result.vin
  bikeModel.value = result.reported_bike_spec_name
}

const confirmBikeInBrand = async () => {
  acceptDialog.value = false
  const stop = start(true)
  try {
    await updateDealerSupportHubBrand(dealerSupportHubId.value, currentBrandId.value)
    router.push({
      name: Routes.VerifyBike,
      params: { dealerSupportHubId: dealerSupportHubId.value },
    })
  } catch (error) {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.ConfirmBrandId))
  } finally {
    stop()
  }
}

const setUserBrandList = async () => {
  const allBrandIdList = await getAllBrandIdList()
  currentBrandId.value = allBrandIdList.length > 0 ? allBrandIdList[0] : currentBrandIdList[0]
  if (currentBrandId.value === 0) {
    router.push({ name: Routes.VerifyCode })
    return
  }
  userBrandList.value =
    allBrandIdList.length > 0
      ? await getUserBrandList(allBrandIdList)
      : await getUserBrandList(currentBrandIdList)
}

onMounted(async () => {
  const stop = start(true)
  await Promise.all([setPostBundleInfo(), setUserBrandList()]).finally(stop)
})
</script>
<template>
  <div class="verify-code-box flex justify-center">
    <div class="text-center">
      <h3 class="fs-headline text-on-background">Does This Bike Belong to Your Brand?</h3>
      <FormGroup class="text-left">
        <div class="ml-2">
          <label class="fs-label text-on-surface-variant">Bike Model</label>
          <div class="fw-normal mt-2 text-on-background">{{ bikeModel }}</div>
        </div>
        <hr class="divider mt-3" />
        <div class="ml-2">
          <label class="fs-label text-on-surface-variant">Frame Number</label>
          <div class="fw-normal mt-2 text-on-background">{{ frameNumber }}</div>
        </div>
        <div v-if="userBrandList.length > 1">
          <hr class="divider mt-3" />
          <div class="ml-2">
            <label class="fs-label text-on-surface-variant">Select Bike's Brand</label>
            <Select v-model="currentBrandId" :option-list="userBrandList" />
          </div>
        </div>
      </FormGroup>
      <Alert
        class="fw-normal text-on-surface-variant"
        text="If not your brand's bike, inform the shop to contact the right service center."
        :icon="Icons.INFO" />
    </div>

    <div class="button-group flex justify-center py-3 bg-background w-100">
      <Button type="tonal" class="mr-3" @click="informDialog = true">No, Back to Overview</Button>
      <Button type="filled" @click="acceptDialog = true">Yes, Accept the Bike</Button>
    </div>

    <Dialog
      :title="'Are you sure to accept?'"
      :is-show="acceptDialog"
      @click-cancel="acceptDialog = false"
      @click-confirm="confirmBikeInBrand">
      <div class="dialog-content">
        Confirm carefully, If you accept the Bike, it will be affiliated with your brand.
      </div>
    </Dialog>

    <Dialog
      :title="'Inform Bike Shop to Contact Correct Service Center'"
      :is-show="informDialog"
      :cancel-text="''"
      :hide-cancel-button="true"
      :confirm-text="'I Got It'"
      @click-confirm="router.push({ name: Routes.PostBundleOverview })">
      <div class="dialog-content">
        Please inform the bike shop to reach out to the correct service center.
      </div>
    </Dialog>
  </div>
</template>
<style scoped>
:deep(.hy-form-group-header) {
  height: 0px;
}

.button-group {
  position: fixed;
  bottom: 0;
}

.dialog-content {
  max-width: 500px;
}
</style>
