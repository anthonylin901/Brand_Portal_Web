<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { ErrorObject } from "@vuelidate/core"
import { FormGroup, Button, Dialog, Select, Icons, useLoading } from "hyena-design-system"
import EditableLabel from "@/components/blocks/EditableLabel.vue"
import { useRoute } from "vue-router"
import { Permissions, Routes } from "@/types/enums"
import { CaseManagementStatus, BundlePartType, ReporterRole } from "hyena-brand-portal-api-client"
import { userStore, caseStore } from "@/stores"
import { errorAlert, successAlert } from "@/utils/alert"
import { capitalize } from "vue"
import { AxiosError } from "axios"
import {
  getSerialNumberValidator,
  getOptionValidator,
} from "@/components/views/post-bundle/verify/validator"
import { Category } from "@/types/post-bundle-type"
import { usePostBundleCaseVerify } from "@/components/views/post-bundle-case/verify/use-post-bundle-case-verify"
// Start: Sharing with post-bundle
import ProgressBar, { ProgressSection } from "@/components/views/post-bundle/verify/ProgressBar.vue"
import { Message } from "@/components/views/post-bundle/post-bundle"
import PartNumberIncompatibleContent from "@/components/views/post-bundle-case/verify/PartNumberIncompatibleContent.vue"
import { ApiErrorCode } from "@/types/error"
// End: Sharing with post-bundle

const FRAME_NUMBER = "frameNumber"
const router = useRouter()
const { start } = useLoading()

// Prepare case data
const caseId = useRoute().params.caseId as string
const {
  postBundleCase,
  formSerialNumberInfo,
  bundleRule,
  formBikeSpecId,
  formBikeShop,
  formReporterContact,
  formBrandId,
  formNote,
  isLoading,
  initData,
  updatePostBundleCase,
  handlePostBundleCase,
} = usePostBundleCaseVerify(caseId)

const isShowingAuthorizeResultDialog = ref(false)
const isShowingApproveDialog = ref(false)
const bikeSpecList = computed(() => caseStore.getIdValuedBikeSpecNameList)
const bundlePartList = computed(() => {
  return (bundleRule.value?.barcode_parts || [])
    .map(part => part.bundle_part_type)
    .concat((bundleRule.value?.protocol_parts || []).map(part => part.bundle_part_type))
})

// Create validators
const partNumberIncompatibleDialog = ref(false)
const vOption$ = getOptionValidator(formBrandId, formBikeSpecId)
const vSerialNumberInfo$ = getSerialNumberValidator(
  formSerialNumberInfo,
  bundleRule,
  bundlePartList
)

const frozenStatus: Array<CaseManagementStatus> = [
  CaseManagementStatus.Approved,
  CaseManagementStatus.Completed,
]
const isEditableStatus = computed(
  () => !!postBundleCase.value && !frozenStatus.includes(postBundleCase.value!.status)
)
const canHandleCase = computed(() => userStore.canUserDo(Permissions.HANDLE_CASE_MANAGEMENT))
const canUpdateCase = computed(() => userStore.canUserDo(Permissions.UPDATE_CASE_MANAGEMENT))

const FormTitles = {
  VERIFY_BIKE_MODEL: "Verify Bike Model",
  VERIFY_COMPONENTS_ON_THIS_BIKE: "Verify Components on This Bike",
  CONTACT_INFO: "Contact Info.",
  NOTE: "Note",
}
// 控制右側section scroll
const sectionList = computed(() => {
  const sectionDefaultList = [
    FormTitles.VERIFY_BIKE_MODEL,
    FormTitles.VERIFY_COMPONENTS_ON_THIS_BIKE,
    FormTitles.CONTACT_INFO,
    FormTitles.NOTE,
  ]
  return sectionDefaultList.map(sectionDefault => {
    return {
      label: sectionDefault,
      elementId: sectionDefault,
    }
  })
})

const directSection = ref<ProgressSection | undefined>(sectionList.value[0])
const validateForm = async () => {
  await Promise.all([vSerialNumberInfo$.value.$validate(), vOption$.value.$validate()])
  if (!isFormValid.value) {
    scrollToInvalidateForm(!vSerialNumberInfo$.value.$invalid, !vOption$.value.$invalid)
  }
}

const isFormValid = computed(() => {
  return !vSerialNumberInfo$.value.$invalid && !vOption$.value.$invalid
})

const scrollToInvalidateForm = async (serialNumberVerified: boolean, optionVerified: boolean) => {
  directSection.value = undefined
  await nextTick()
  directSection.value = sectionList.value.find(section => {
    if (!serialNumberVerified) {
      return section.label === FormTitles.VERIFY_COMPONENTS_ON_THIS_BIKE
    } else if (!optionVerified) {
      return section.label === FormTitles.VERIFY_BIKE_MODEL
    }
  })
}

const messageMap: Record<string, string> = {
  [ApiErrorCode.UniqueViolationException]: "The frame number has been approved.",
  [ApiErrorCode.UnhandledException]: "Sorry, unexpected error.",
  [ApiErrorCode.NotFoundException]: "Resource not found.",
  [ApiErrorCode.RestrictionException]: "The information cannot be modified.",
  [ApiErrorCode.UnmatchedBundleRuleException]: "The components does not match the bike spec.",
}
const promptError = (error: unknown) => {
  let message = "Sorry, unexpected error."
  if (error instanceof AxiosError && error.response?.data?.code) {
    const code = error.response?.data?.code as string
    if (code in messageMap) {
      message = messageMap[code]
    }
  }
  errorAlert(message)
}

const savePostBundleCase = async (status?: CaseManagementStatus) => {
  const stop = start(true)
  try {
    const barcodePartList = (Object.keys(formSerialNumberInfo.value) as BundlePartType[])
      .filter(key => bundleRule.value?.barcode_parts.find(part => part.bundle_part_type === key))
      .map(key => ({
        part_type: key,
        barcode: formSerialNumberInfo.value[key].value as string,
      }))

    const caseId = postBundleCase.value?.id as string
    const payload = {
      status:
        status ||
        (postBundleCase.value?.status === CaseManagementStatus.ToDo
          ? CaseManagementStatus.Processing
          : postBundleCase.value?.status),
      vin: formSerialNumberInfo.value[FRAME_NUMBER].value,
      note: formNote.value,
      bike_spec_id: formBikeSpecId.value,
      barcode_part_list: barcodePartList,
    }

    if (canHandleCase.value) {
      await handlePostBundleCase(caseId, payload)
    } else if (canUpdateCase.value) {
      await updatePostBundleCase(caseId, payload)
    } else {
      throw new Error("You don't have permission to handle this case.")
    }
    return true
  } catch (error) {
    promptError(error)
    return false
  } finally {
    stop()
  }
}

const handleSaveEvent = async (successMessage: string) => {
  const isSuccessful = await savePostBundleCase()
  if (isSuccessful) {
    successAlert(successMessage)
    router.push({ name: Routes.PostBundleCaseOverview })
  }
}

const onUpdateClick = async () => {
  await validateForm()
  if (isFormValid.value) {
    await handleSaveEvent("Successfully updated.")
  } else {
    errorAlert(Message.INVALID_VALUE)
  }
}

const onApproveClick = async () => {
  await validateForm()
  if (isFormValid.value) {
    isShowingApproveDialog.value = true
  } else {
    errorAlert(Message.INVALID_VALUE)
  }
}

const reallyApprovePostBundle = async () => {
  isShowingApproveDialog.value = false
  const isSuccessful = await savePostBundleCase(CaseManagementStatus.Approved)
  if (isSuccessful) {
    isShowingAuthorizeResultDialog.value = true
  }
}

const onConfirmAuthorizeResultClick = () => {
  isShowingAuthorizeResultDialog.value = false
  router.push({ name: Routes.PostBundleCaseOverview })
}

const getFieldNote = (key: string): string => {
  const errors: Array<ErrorObject> = vSerialNumberInfo$.value[key]?.$silentErrors || []
  if (vSerialNumberInfo$.value[key]?.$dirty && errors.length > 0) {
    return errors.map(error => error.$message || Message.INVALID_VALUE).join(", ")
  }
  return ""
}

const isBundlePart = (part: BundlePartType | typeof FRAME_NUMBER) => {
  if (part === FRAME_NUMBER) {
    return false
  }
  return bundlePartList.value.includes(part)
}

const isEditablePart = (category: string) => {
  return category === Category.BARCODE_PART || category === Category.FRAME_NUMBER
}

let stop: (() => void) | null = null
watch(isLoading, newValue => {
  if (stop) {
    stop()
  }

  if (newValue) {
    stop = start(true)
  }
})

onMounted(async () => {
  try {
    await initData()
  } catch (error) {
    errorAlert("API Error, please try again.")
    router.replace({ name: Routes.PostBundleCaseOverview })
  }
})
</script>

<template>
  <div v-if="postBundleCase" class="verify-bike-container flex">
    <Teleport to="#page-header-teleport">
      <div class="frame-number-title">Frame Number</div>
      <div class="frame-number">{{ formSerialNumberInfo[FRAME_NUMBER].value }}</div>
    </Teleport>

    <div class="left" />
    <div class="verify-bike-box flex justify-center center">
      <h3 class="fs-headline text-on-background">Verify Information with Bike Shop</h3>
      <FormGroup :id="FormTitles.VERIFY_BIKE_MODEL" title="Verify Bike Model">
        <Select
          v-model="formBikeSpecId"
          :option-list="bikeSpecList"
          label="*Verify Bike Model"
          :is-error="vOption$.bikeSpecId.$error"
          :note="vOption$.bikeSpecId.$error ? Message.REQUIRE_FILED : ''"
          filterable
          :disabled="!isEditableStatus" />
      </FormGroup>

      <FormGroup
        :id="FormTitles.VERIFY_COMPONENTS_ON_THIS_BIKE"
        title="Verify Components on This Bike">
        <div class="mt-4">
          <div class="mt-3 mb-4">Verify or edit serial numbers.</div>
          <EditableLabel
            :key="formSerialNumberInfo[FRAME_NUMBER].value"
            v-model="formSerialNumberInfo[FRAME_NUMBER].value"
            title="Frame Number"
            class="ml-2"
            :editable="isEditableStatus"
            :error="vSerialNumberInfo$[FRAME_NUMBER].value.$error"
            :note="vSerialNumberInfo$[FRAME_NUMBER].value.$error ? Message.INVALID_VALUE : ''"
            :error-icon="Icons.HELP"
            @click-error-icon="partNumberIncompatibleDialog = true" />
        </div>
        <div v-for="(info, key) in formSerialNumberInfo" :key="key">
          <div v-if="isBundlePart(key)" class="ml-2 mt-4">
            <EditableLabel
              v-if="info.category === Category.PROTOCOL_PART"
              v-model="info.value"
              :title="`${capitalize(key)} Serial Number`"
              :editable="false"
              :error="vSerialNumberInfo$[key].value.$error"
              :note="getFieldNote(key)"
              :description="'Verified by System'"
              :error-icon="Icons.HELP"
              @click-error-icon="partNumberIncompatibleDialog = true" />
            <EditableLabel
              v-else-if="info.category === Category.BARCODE_PART"
              v-model="info.value"
              :title="`${capitalize(key)} Serial Number`"
              :editable="isEditablePart(info.category) && isEditableStatus"
              :error="vSerialNumberInfo$[key].value.$error"
              :note="getFieldNote(key)"
              :description="''"
              :error-icon="Icons.HELP"
              @click-error-icon="partNumberIncompatibleDialog = true" />
          </div>
        </div>
      </FormGroup>

      <FormGroup
        v-if="formBikeShop && formReporterContact"
        :id="FormTitles.CONTACT_INFO"
        title="Contact Info.">
        <div class="mt-4">
          <EditableLabel v-model="formBikeShop.name" title="Bike Shop" :editable="false" />
          <EditableLabel
            :model-value="formReporterContact.first_name + ' ' + formReporterContact.last_name"
            title="Reporter"
            :editable="false"
            class="mt-2" />
          <EditableLabel
            v-model="formReporterContact.email"
            title="E-Mail"
            :editable="false"
            class="mt-2" />
          <EditableLabel
            v-if="formReporterContact.role === ReporterRole.Dealer"
            :model-value="`+${formBikeShop.phone_number.calling_code} ${formBikeShop.phone_number.number}`"
            title="Phone"
            class="mt-2"
            :editable="false" />
          <EditableLabel
            :model-value="postBundleCase.message || 'N/A'"
            title="Message"
            class="mt-2 message-editable-label"
            :editable="false" />
        </div>
      </FormGroup>

      <FormGroup :id="FormTitles.NOTE" title="Note">
        <textarea
          v-model="formNote"
          :disabled="!isEditableStatus"
          class="textarea-box mt-3"
          placeholder="Please type your note for this case" />
      </FormGroup>
    </div>
    <div class="right">
      <ProgressBar
        :key="sectionList.length"
        class="progress-bar right"
        :section-list="sectionList"
        :direct-section="directSection" />
    </div>
  </div>
  <div
    v-if="postBundleCase"
    class="button-group flex justify-center align-items-center py-3 bg-background w-100">
    <template v-if="canHandleCase">
      <div>You may '<span class="fw-semi-bold">Save</span>' to proceed later.</div>
      <Button
        type="tonal"
        class="mx-3"
        :disabled="!isEditableStatus"
        @click="() => handleSaveEvent('Succsfully saved.')">
        Save
      </Button>
      <Button type="filled" :disabled="!isEditableStatus" @click="onApproveClick"
        >Approve Post-Bundle</Button
      >
    </template>
    <Button
      v-else-if="canUpdateCase"
      type="filled"
      :disabled="!isEditableStatus"
      @click="onUpdateClick"
      >Update</Button
    >
  </div>
  <Dialog
    title="Are you sure to post-bundle this bike?"
    :is-show="isShowingApproveDialog"
    @click-cancel="isShowingApproveDialog = false"
    @click-confirm="reallyApprovePostBundle">
    <div class="dialog-content">
      <div>You CANNOT undo this action. Please ensure all information is correct.</div>
    </div>
  </Dialog>
  <Dialog
    width="320px"
    :hide-cancel-button="true"
    confirm-text="I Got It"
    title="Successfully approved, await for bike reconnect"
    :is-show="isShowingAuthorizeResultDialog"
    @click-confirm="onConfirmAuthorizeResultClick">
    <div class="dialog-content fs-body-1 mt-4">
      <div>
        We've sent an email to notify the dealer to "<b>reconnect the bike to Dealer Portal</b>" to
        complete post-bundle process.
      </div>
    </div>
  </Dialog>
  <Dialog
    class="part-number-incompatible-dialog"
    :is-show="partNumberIncompatibleDialog"
    title="Part Number Incompatible with Bike Model"
    is-delete
    confirm-text="I Got It"
    width="550px"
    hide-cancel-button
    :icon="Icons.ERROR"
    @click-confirm="partNumberIncompatibleDialog = false">
    <div class="dialog-content">
      <PartNumberIncompatibleContent />
    </div>
  </Dialog>
</template>

<style scoped>
.post-bundle-case-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.action-bar {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.frame-number-title {
  font-size: 1rem;
  font-weight: 700;
}

.frame-number {
  display: block;
  font-size: 2.8rem;
  font-weight: 700;
}

.textarea-box {
  width: 100%;
  height: 220px;
  border-radius: 0.2rem;
  padding: 16px;
  resize: none;
}

.verify-bike-box {
  max-width: 45rem;
  margin: 0 auto;
  position: relative;
}

.verify-bike-container {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
}

@media only screen and (max-width: 1500px) {
  .verify-bike-box {
    max-width: 40rem;
  }
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

.dialog-content {
  font-size: 16px;
  line-height: 1.5;
}

:deep(.editable-label-box .text-on-background) {
  font-weight: 600;
}

:deep(.message-editable-label .editable-label-box) {
  border-bottom: none !important;
}

:deep(.editable-label-error .text-on-background) {
  color: #ba1a1a !important;
}

.part-number-incompatible-dialog :deep(.el-dialog__footer) {
  padding-top: 32px !important;
  padding-bottom: 0px !important;
}

.part-number-incompatible-dialog :deep(.el-dialog) {
  padding-bottom: 16px !important;
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
