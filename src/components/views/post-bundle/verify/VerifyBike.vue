<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from "vue"
import EditableLabel from "@/components/blocks/EditableLabel.vue"
import ProgressBar, { ProgressSection } from "@/components/views/post-bundle/verify/ProgressBar.vue"
import PartNumberIncompatibleContent from "@/components/views/post-bundle/verify/PartNumberIncompatibleContent.vue"
import { BundlePartType, BundleRule, DealerSupportHubStatus } from "hyena-brand-portal-api-client"
import {
  FormGroup,
  Button,
  Dialog,
  RadioListGroup,
  Select,
  useLoading,
  GoTop,
  Icons,
  TextDivider,
  Option,
} from "hyena-design-system"
import {
  getDealerSupportHub,
  getBrandList,
  getBikeSpec,
  getBundleRule,
  Message,
} from "@/components/views/post-bundle/post-bundle"
import {
  getSerialNumberInfo,
  defaultSerialNumberInfo,
  defaultContactInfo,
  getPostBundleBundleInfo,
  getLightConfiguration,
  getContactInfo,
  lightRadioOptionList,
  updatePostBundle,
  updateDealerSupportHub,
  createBike,
  updateDealerSupportHubHandleCase,
  FormTitles,
  isEditablePart,
  getBundlePartList,
  getBikeSpecByBrand,
  FRAME_NUMBER,
} from "@/components/views/post-bundle/verify/verify-bike"
import { updateDealerSupportHubBrand } from "@/components/views/post-bundle/brand-check/brand-check"
import { useRoute, useRouter } from "vue-router"
import {
  getSerialNumberValidator,
  getContactInfoValidator,
  getOptionValidator,
} from "@/components/views/post-bundle/verify/validator"
import { SerialNumberInfo, ContactInfo, Category } from "@/types/post-bundle-type"
import { Routes, Permissions } from "@/types/enums"
import { errorAlert, successAlert } from "@/utils/alert"
import { userStore, postBundleStore } from "@/stores"
import { getApiErrorMessage, ApiFunctionName } from "@/errors/api-errors"

const { start } = useLoading()
const route = useRoute()
const router = useRouter()
const postBundleStatus = ref<DealerSupportHubStatus>()
const dealerSupportHubId = +(route.params.dealerSupportHubId as string)
const isBrandAssigned = ref<boolean>(false)
const bundleRule = ref<BundleRule>()
const bundlePartList = ref<BundlePartType[]>([])
const bikeSpecList = ref<Option[]>([])
// Form 變數與驗證宣告
const currentBrand = ref<number>()
const currentBikeSpec = ref<number>()
const vOption$ = getOptionValidator(currentBrand, currentBikeSpec)
const serialNumberInfo = ref<SerialNumberInfo>(defaultSerialNumberInfo)
const vSerialNumberInfo$ = getSerialNumberValidator(serialNumberInfo, bundleRule, bundlePartList)
const lightConfiguration = ref({
  front_light: false,
  rear_light: false,
})
const contactInfo = ref<ContactInfo>(defaultContactInfo)
const vContactInfo$ = getContactInfoValidator(contactInfo)
// HST 使用者輸入的 Bike model
const reportBikeModel = ref<string>("-")
// Dialog 狀態
const approveDialog = ref(false)
const partNumberIncompatibleDialog = ref(false)
// 控制右側section scroll
const sectionList = computed(() => {
  const sectionDefaultList = [
    FormTitles.VERIFY_BIKE_MODEL,
    FormTitles.VERIFY_PARTS_ON_THIS_BIKE,
    FormTitles.LIGHT_CONFIRMATION,
    FormTitles.CONTACT_INFO,
    FormTitles.NOTE,
  ]
  if (!isBrandAssigned.value) {
    sectionDefaultList.unshift(FormTitles.ASSIGN_TO_BRAND)
  }
  const sectionList = sectionDefaultList.map(sectionDefault => {
    return {
      label: sectionDefault,
      elementId: sectionDefault,
    }
  })
  return sectionList
})
const directSection = ref<ProgressSection | undefined>(sectionList.value[0])

// 沒被賦予Brand或是"售服權限"就能更改
const isBrandAssignable = computed(() => !isBrandAssigned.value || userStore.isSpecificRole("Hyena-Service") || userStore.isSpecificRole("Hyena-Service-Center"))

// post bundle status為 Approved、Completed 不能編輯
const isEditableStatus = computed(
  () =>
    postBundleStatus.value !== DealerSupportHubStatus.Approved &&
    postBundleStatus.value !== DealerSupportHubStatus.Completed
)
// Bike model 只能選擇在 brand 底下的
watch(currentBrand, async newBrandId => {
  if (newBrandId) {
    currentBikeSpec.value = undefined
    bikeSpecList.value = await getBikeSpecByBrand(newBrandId)
  }
})
// Bike model 更改就重設定 bundle 規則與驗證的 parts
watch(currentBikeSpec, async newBikeSpec => {
  if (newBikeSpec) {
    await setBikeSpecBundleRule(+newBikeSpec)
  }
})

const isBundlePart = (part: BundlePartType | typeof FRAME_NUMBER) => {
  if (part === FRAME_NUMBER) {
    return false
  }
  return bundlePartList.value.includes(part)
}

const setBikeSpecBundleRule = async (bikeSpec: number) => {
  const stop = start(true)
  try {
    bundleRule.value = await getBundleRule(bikeSpec)
    bundlePartList.value = getBundlePartList(bundleRule.value)
  } catch (error) {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.GetBundleRule))
  } finally {
    stop()
  }
}

const setBundleBikeInfo = async () => {
  const [bundleInfo, dealerSupportHubInfo] = await Promise.all([
    getPostBundleBundleInfo(dealerSupportHubId),
    getDealerSupportHub(dealerSupportHubId),
  ])
  setCurrentBrand(dealerSupportHubInfo.brand_id)
  bikeSpecList.value = await getBikeSpecByBrand()
  reportBikeModel.value = bundleInfo.reported_bike_spec_name
  currentBikeSpec.value = bundleInfo.bike_spec_id
  serialNumberInfo.value = getSerialNumberInfo(bundleInfo)
  contactInfo.value = getContactInfo(dealerSupportHubInfo)
  postBundleStatus.value = dealerSupportHubInfo.status
  lightConfiguration.value = getLightConfiguration(bundleInfo.bundle.additional_parts)
}

const setCurrentBrand = (brandId?: number) => {
  if (brandId) {
    currentBrand.value = brandId
    isBrandAssigned.value = true
  }
}

const setOptionList = async () => {
  await Promise.all([getBrandList(), getBikeSpec()]) // Brand會依照權限可看到的顯示
}

const updateBrandAndSave = async () => {
  currentBrand.value
    ? await Promise.all([
        updateDealerSupportHubBrand(dealerSupportHubId, currentBrand.value),
        save(),
      ])
    : errorAlert(Message.SELECT_BRAND)
  router.push({ name: Routes.PostBundleOverview })
}

const updateHandlerAndSave = async () => {
  await Promise.all([updateDealerSupportHubHandleCase(dealerSupportHubId), save()])
  router.push({ name: Routes.PostBundleOverview })
}

// 儲存最新修改資料不檢查
const save = async () => {
  const stop = start(true)
  try {
    if (currentBrand.value) {
      await Promise.all([
        updateDealerSupportHub(dealerSupportHubId, currentBrand.value, contactInfo.value),
        updatePostBundle(
          dealerSupportHubId,
          serialNumberInfo.value,
          lightConfiguration.value,
          currentBikeSpec.value
        ),
      ])
    } else {
      errorAlert(Message.No_BRAND)
    }
  } catch (error) {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.SavePostBundle))
  } finally {
    stop()
  }
}

// 檢查所有規則後儲存
const approvePostBundle = async () => {
  approveDialog.value = false
  const [serialNumberVerified, contactInfoVerified, optionVerified] = await Promise.all([
    vSerialNumberInfo$.value.$validate(),
    vContactInfo$.value.$validate(),
    vOption$.value.$validate(),
  ])
  if (serialNumberVerified && contactInfoVerified && optionVerified) {
    const stop = start(true)
    try {
      await save()
      await createBike(dealerSupportHubId) // createBike 需要在所有資料齊全才能觸發
      router.push({ name: Routes.PostBundleOverview })
      successAlert(Message.SAVE_SUCCESS)
    } catch (error) {
      errorAlert(getApiErrorMessage(error, ApiFunctionName.ApprovePostBundle))
    } finally {
      stop()
    }
    return
  }
  scrollToInvalidateForm(serialNumberVerified, contactInfoVerified, optionVerified)
}

const scrollToInvalidateForm = async (
  serialNumberVerified: boolean,
  contactInfoVerified: boolean,
  optionVerified: boolean
) => {
  directSection.value = undefined
  await nextTick()
  directSection.value = sectionList.value.find(section => {
    if (!optionVerified) {
      return (
        section.label === FormTitles.ASSIGN_TO_BRAND ||
        section.label === FormTitles.VERIFY_BIKE_MODEL
      )
    } else if (!serialNumberVerified) {
      return section.label === FormTitles.VERIFY_PARTS_ON_THIS_BIKE
    } else if (!contactInfoVerified) {
      return section.label === FormTitles.CONTACT_INFO
    }
  })
}

onMounted(async () => {
  const stop = start(true)
  try {
    await Promise.all([setBundleBikeInfo(), setOptionList()])
  } catch (error) {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.GetBundleInfo))
  } finally {
    stop()
  }
})
</script>
<template>
  <div>
    <div class="verify-bike-container">
      <div class="left" />
      <div class="verify-bike-box flex justify-center center">
        <div class="text-center mb-5">
          <h3 class="fs-headline text-on-background">Verify Information with Bike Shop</h3>
          <div v-if="isBrandAssignable">
            <FormGroup
              :id="FormTitles.ASSIGN_TO_BRAND"
              title="Assign to Brand"
              class="py-5 text-left">
              <Select
                v-model="currentBrand"
                :label="'*Select Bike Brand'"
                :option-list="postBundleStore.getBrandOptionList"
                :is-error="vOption$.brandId.$error"
                :note="vOption$.brandId.$error ? Message.REQUIRE_FILED : ''"
                :disabled="!isEditableStatus"
                filterable
                class="mt-4" />
            </FormGroup>

            <TextDivider :label="'or approve it yourself'" class="my-5" />
          </div>

          <FormGroup
            :id="FormTitles.VERIFY_BIKE_MODEL"
            :title="FormTitles.VERIFY_BIKE_MODEL"
            class="py-5 text-left">
            <div class="ml-3 mt-4">
              <label class="fs-label text-on-surface-variant">Bike Model</label>
              <div class="fw-normal mt-2 text-on-background">{{ reportBikeModel }}</div>
            </div>
            <Select
              :key="currentBrand"
              v-model="currentBikeSpec"
              :label="'*Verify Bike Model'"
              :option-list="bikeSpecList"
              :is-error="vOption$.bikeSpecId.$error"
              :note="vOption$.bikeSpecId.$error ? Message.REQUIRE_FILED : ''"
              filterable
              :disabled="!isEditableStatus"
              class="mt-4" />
          </FormGroup>

          <FormGroup
            :id="FormTitles.VERIFY_PARTS_ON_THIS_BIKE"
            :title="FormTitles.VERIFY_PARTS_ON_THIS_BIKE"
            class="py-5 text-left">
            <div class="ml-1 mt-3">Verify or edit serial numbers.</div>

            <div class="ml-2 mt-4">
              <EditableLabel
                :key="serialNumberInfo[FRAME_NUMBER].value"
                v-model="serialNumberInfo[FRAME_NUMBER].value"
                title="Frame Number"
                :editable="isEditableStatus"
                :error="vSerialNumberInfo$[FRAME_NUMBER].value.$error"
                :error-icon="Icons.HELP"
                :note="
                  vSerialNumberInfo$[FRAME_NUMBER].value.$error
                    ? Message.INCOMPATIBLE_BIKE_MODEL
                    : ''
                "
                @click-error-icon="partNumberIncompatibleDialog = true" />
            </div>

            <div v-if="currentBikeSpec && bundlePartList.length > 0">
              <div v-for="(info, key) in serialNumberInfo" :key="key">
                <div v-if="isBundlePart(key)" class="ml-2 mt-4">
                  <EditableLabel
                    v-if="info?.id && info.category === Category.PROTOCOL_PART"
                    v-model="info.value"
                    :title="`${key} Serial Number`"
                    :editable="false"
                    :error="vSerialNumberInfo$[key].value.$error"
                    :note="vSerialNumberInfo$[key].value.$error ? Message.INVALID_VALUE : ''"
                    :description="'Verified by System'" />
                  <EditableLabel
                    v-else-if="info.category === Category.BARCODE_PART"
                    v-model="info.value"
                    :title="`${key} Serial Number`"
                    :editable="isEditablePart(info.category) && isEditableStatus"
                    :error="vSerialNumberInfo$[key].value.$error"
                    :note="vSerialNumberInfo$[key].value.$error ? Message.INVALID_VALUE : ''"
                    :description="''" />
                </div>
              </div>
            </div>
          </FormGroup>

          <FormGroup
            :id="FormTitles.LIGHT_CONFIRMATION"
            :title="FormTitles.LIGHT_CONFIRMATION"
            class="py-5 text-left">
            <div class="ml-1 mt-3">Check if the bike has lights installed.</div>
            <div class="ml-2 mt-4">
              <div class="text-on-surface-variant mb-3">*Front Light</div>
              <RadioListGroup
                v-model="lightConfiguration.front_light"
                :name="'frontLight'"
                :radio-list="lightRadioOptionList"
                :disabled="!isEditableStatus" />
            </div>
            <div class="ml-2 mt-4">
              <div class="text-on-surface-variant mb-3">*Rear Light</div>
              <RadioListGroup
                v-model="lightConfiguration.rear_light"
                :name="'rearLight'"
                :radio-list="lightRadioOptionList"
                :disabled="!isEditableStatus" />
            </div>
          </FormGroup>

          <FormGroup :id="FormTitles.CONTACT_INFO" title="Contact Info." class="py-5 text-left">
            <div class="ml-2 mt-4">
              <EditableLabel
                :key="contactInfo.bikeShop"
                v-model="contactInfo.bikeShop"
                title="Bike Shop"
                :editable="isEditableStatus"
                :error="vContactInfo$.bikeShop.$error"
                :note="vContactInfo$.bikeShop.$error ? Message.REQUIRE_FILED : ''" />
            </div>
            <div class="ml-2 mt-4">
              <EditableLabel
                :key="contactInfo.name"
                v-model="contactInfo.name"
                title="Report"
                :editable="isEditableStatus"
                :error="vContactInfo$.name.$error"
                :note="vContactInfo$.name.$error ? Message.REQUIRE_FILED : ''" />
            </div>
            <div class="ml-2 mt-4">
              <EditableLabel
                :key="contactInfo.email"
                v-model="contactInfo.email"
                title="E-mail"
                :editable="isEditableStatus"
                :error="vContactInfo$.email.$error"
                :note="vContactInfo$.email.$error ? vContactInfo$.email.$errors[0].$message : ''" />
            </div>
            <div class="ml-2 mt-4">
              <EditableLabel
                :key="contactInfo.phone"
                v-model="contactInfo.phone"
                title="Phone"
                :editable="isEditableStatus"
                :error="vContactInfo$.phone.$error"
                :note="vContactInfo$.phone.$error ? Message.REQUIRE_FILED : ''" />
            </div>
            <div class="ml-3 mt-4">
              <label class="fs-label text-on-surface-variant">Message</label>
              <div class="mt-2">{{ contactInfo.message }}</div>
            </div>
          </FormGroup>

          <FormGroup :id="FormTitles.NOTE" :title="FormTitles.NOTE" class="py-5 text-left">
            <textarea
              v-model="contactInfo.handlerMessage"
              class="textarea-box"
              placeholder="Please type your note for this case" />
          </FormGroup>
        </div>
      </div>
      <div>
        <ProgressBar
          :key="sectionList.length"
          class="progress-bar right"
          :section-list="sectionList"
          :direct-section="directSection" />
      </div>
    </div>
    <div class="button-group flex justify-center align-items-center py-3 bg-background w-100">
      <div
        v-if="userStore.canUserDo(Permissions.HANDLE_DEALER_SUPPORT_HUB)"
        class="flex justify-center align-items-center">
        <div class="mr-3">You may <span class="fw-bold">'Save'</span> to proceed later.</div>
        <Button
          type="tonal"
          class="mr-3"
          :disabled="!isEditableStatus"
          @click="updateHandlerAndSave"
          ><span>Save</span>
        </Button>
      </div>
      <Button
        v-else
        type="tonal"
        class="mr-3"
        :disabled="!isEditableStatus"
        @click="updateBrandAndSave">
        Assign to Brand
      </Button>
      <Button
        v-if="userStore.canUserDo(Permissions.HANDLE_DEALER_SUPPORT_HUB)"
        type="filled"
        :disabled="!isBrandAssigned || !isEditableStatus"
        @click="approveDialog = true">
        Approve Post-bundle
      </Button>
    </div>
    <GoTop />
    <Dialog
      title="Are you sure to post-bundle this bike?"
      :is-show="approveDialog"
      @click-cancel="approveDialog = false"
      @click-confirm="approvePostBundle">
      <div class="dialog-content">
        <div>You CANNOT undo this action. Please ensure all information is correct.</div>
        <div class="mt-2">
          If you confirm this bike, notify the reporter to reconnect the bike to
          <strong>Dealer Portal</strong>
          to COMPLETE post-bundle process.
        </div>
      </div>
    </Dialog>

    <Dialog
      class="part-number-incompatible-dialog"
      :is-show="partNumberIncompatibleDialog"
      title="Part Number Incompatible with Bike Model"
      is-delete
      hide-cancel-button
      confirm-text="I Got It"
      width="550px"
      :icon="Icons.ERROR"
      @click-confirm="partNumberIncompatibleDialog = false">
      <div class="dialog-content">
        <PartNumberIncompatibleContent />
      </div>
    </Dialog>
  </div>
</template>
<style scoped>
.verify-bike-box {
  max-width: 45rem;
  margin: 0 auto;
  position: relative;
}

.button-group {
  position: sticky;
  bottom: 0;
}

.dialog-content {
  max-width: 500px;
}

.textarea-box {
  width: 100%;
  height: 220px;
  border-radius: 0.2rem;
  padding: 0.5rem;
  resize: none;
}

.left,
.right {
  flex-basis: 0;
  flex-shrink: 0;
  flex-grow: 0.7;
}

.center {
  flex-grow: 1;
  margin: 0 50px;
}

.hy-progress-bar {
  position: sticky;
  left: 0;
  top: 195px;
}

.verify-bike-container {
  display: flex;
  flex-wrap: nowrap;
}

@media only screen and (max-width: 1500px) {
  .verify-bike-box {
    max-width: 40rem;
  }
}

.part-number-incompatible-dialog :deep(.btn.bg-error) {
  background-color: #006c4d !important;
}

.part-number-incompatible-dialog :deep(.el-dialog__header > div:first-child) {
  display: flex;
  padding-bottom: 24px;
  align-items: center;
  gap: 12px;
}
.part-number-incompatible-dialog :deep(.el-dialog__header > div:first-child > *) {
  margin-top: 0 !important;
}

.part-number-incompatible-dialog :deep(.hy-icon) {
  display: inline-flex;
  align-items: center;
}
</style>
