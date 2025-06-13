<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useBikeAuthorizationCaseDetail } from "@/components/views/bike-authorization/detail/use-bike-authorization-case-detail"
import { AxiosError } from "axios"
import { FormGroup, Button, GoTop, useLoading, Dialog } from "hyena-design-system"
import EditableLabel from "@/components/blocks/EditableLabel.vue"
import TextArea from "@/components/blocks/TextArea.vue"
import { CaseManagementStatus, ReporterRole } from "hyena-brand-portal-api-client"
import { errorAlert } from "@/utils/alert"
import { ApiErrorCode } from "@/types/error"
import { getRejectReasonValidator } from "@/components/views/bike-authorization/detail/validator"
import { Routes } from "@/types/enums"

const router = useRouter()
const { start } = useLoading()
const { caseId } = useRoute().params
const { caseDetail, canHandleCase, note, reason, initData, rejectCase, approveCase } =
  useBikeAuthorizationCaseDetail(caseId as string)

const rejectReasonValidator = getRejectReasonValidator(reason)
const isShowingRejectDialog = ref(false)
const isShowingRejectResultDialog = ref(false)
const isShowingAuthorizeDialog = ref(false)
const isShowingAuthorizeResultDialog = ref(false)
const isEditableStatus = computed(() => {
  return (
    caseDetail.value?.status === CaseManagementStatus.ToDo ||
    caseDetail.value?.status === CaseManagementStatus.Processing
  )
})

const onConfirmRejectResultClick = () => {
  isShowingRejectResultDialog.value = false
  router.push({ name: Routes.BikeAuthorizationOverview })
}
const onConfirmAuthorizeResultClick = () => {
  isShowingAuthorizeResultDialog.value = false
  router.push({ name: Routes.BikeAuthorizationOverview })
}

const onRejectClick = async () => {
  rejectReasonValidator.value.$validate()
  if (rejectReasonValidator.value.$invalid) {
    errorAlert("Please fill in the required field.")
    return
  }
  isShowingRejectDialog.value = false
  const stop = start("")
  try {
    await rejectCase(note.value, reason.value)
    isShowingRejectResultDialog.value = true
  } catch (error) {
    promptError(error)
  } finally {
    stop()
  }
}

const onCancelRejectClick = () => {
  isShowingRejectDialog.value = false
  rejectReasonValidator.value.$reset()
  reason.value = ""
}

const onApproveClick = async () => {
  isShowingAuthorizeDialog.value = false
  const stop = start("")
  try {
    await approveCase()
    isShowingRejectDialog.value = false
    isShowingAuthorizeResultDialog.value = true
  } catch (error) {
    promptError(error)
  } finally {
    stop()
  }
}

const messageMap: Record<string, string> = {
  [ApiErrorCode.UniqueViolationException]: "The frame number has been approved.",
  [ApiErrorCode.UnhandledException]: "Sorry, unexpected error.",
  [ApiErrorCode.NotFoundException]: "Resource not found.",
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

onMounted(async () => {
  const stop = start("Getting Bike Authorization Case Detail")
  await initData()
  stop()
})
</script>

<template>
  <div v-if="caseDetail">
    <Teleport to="#page-header-teleport">
      <div class="frame-number-title">Frame Number</div>
      <div class="frame-number">{{ caseDetail.vin }}</div>
    </Teleport>

    <div class="bike-authorization-container">
      <div class="verify-bike-box flex justify-center center">
        <div class="mb-5">
          <h3 class="fs-headline text-on-background text-center">
            Verify Information with Bike Shop
          </h3>
          <FormGroup title="Bike Model Info." class="text-left">
            <div class="flex flex-col ml-3 align-items-center py-3 mt-4">
              <label class="field-title">Bike Model</label>
              <div class="fw-semi-bold">{{ caseDetail.bike_spec.name }}</div>
            </div>

            <div class="divider" />

            <div class="flex flex-col ml-3 align-items-center py-3">
              <label class="field-title">Frame Number</label>
              <div class="fw-semi-bold">{{ caseDetail.vin }}</div>
            </div>

            <div class="divider" />

            <div class="ml-3 align-items-center py-3">
              <div class="field-title">Frame Number Label Photo</div>
              <div class="py-3">
                <img class="image" :src="caseDetail.detail?.vin_image.url" />
              </div>
            </div>

            <div class="divider" />

            <div class="ml-3 align-items-center py-3">
              <div class="field-title">Full Bike Photo</div>
              <div class="py-3">
                <img class="image" :src="caseDetail.detail?.bike_image.url" />
              </div>
            </div>
          </FormGroup>

          <FormGroup title="Contact Info.">
            <EditableLabel
              v-model="caseDetail.bike_shop.name"
              class="mt-4 mb-3"
              title="Bike Shop"
              :editable="false" />
            <EditableLabel
              :model-value="
                caseDetail.reporter_contact.first_name + ' ' + caseDetail.reporter_contact.last_name
              "
              title="Reporter"
              class="mb-3"
              :editable="false" />
            <EditableLabel
              v-model="caseDetail.reporter_contact.email"
              title="E-Mail"
              class="mb-3"
              :editable="false" />
            <EditableLabel
              v-if="caseDetail.reporter_contact.role === ReporterRole.Dealer"
              :model-value="`+${caseDetail.bike_shop.phone_number.calling_code} ${caseDetail.bike_shop.phone_number.number}`"
              title="Phone"
              class="mb-3"
              :editable="false" />
            <EditableLabel
              :model-value="caseDetail.message || 'N/A'"
              title="Message"
              class="mb-3 message-editable-label"
              :editable="false" />
          </FormGroup>
          <FormGroup title="Note" class="py-4 text-left">
            <textarea
              v-model="note"
              :disabled="!isEditableStatus"
              class="textarea-box mt-4"
              placeholder="Please type your note for this case" />
          </FormGroup>
        </div>
      </div>
    </div>
    <div
      v-if="canHandleCase"
      class="button-group flex justify-center align-items-center py-3 bg-background w-100">
      <div class="flex justify-center align-items-center">
        <Button
          :class="{ 'btn-reject': isEditableStatus }"
          :disabled="!isEditableStatus"
          @click="isShowingRejectDialog = true"
          ><span>Reject</span>
        </Button>
        <Button
          type="filled"
          class="ml-3"
          :disabled="!isEditableStatus"
          @click="isShowingAuthorizeDialog = true">
          Approve Bike Authorization
        </Button>
      </div>
    </div>
    <GoTop />
    <Dialog
      title="Are you sure to authorize this bike?"
      :is-show="isShowingAuthorizeDialog"
      @click-cancel="isShowingAuthorizeDialog = false"
      @click-confirm="onApproveClick">
      <div class="dialog-content mt-4">
        <div>You CANNOT undo this action. Please ensure all information is correct.</div>
      </div>
    </Dialog>
    <Dialog
      class="reject-dialog"
      :is-delete="true"
      confirm-text="Reject"
      width="450px"
      title="Confirm the Rejection"
      :is-show="isShowingRejectDialog"
      @click-cancel="onCancelRejectClick"
      @click-confirm="onRejectClick">
      <div class="dialog-content-divider" />
      <div class="dialog-content mt-4">
        <div>Are you sure to reject? This action cannot be undone.</div>
        <div class="mt-2 pt-4">
          <TextArea
            :invalid="rejectReasonValidator.$invalid && rejectReasonValidator.$dirty"
            invalid-text="Please fill in the required field."
            field-name="*Rejection Reason"
            :model-value="reason"
            placeholder="Please describe the rejection reason"
            :rows="10"
            @update:model-value="reason = $event" />
        </div>
      </div>
      <div class="dialog-content-divider pt-4" />
    </Dialog>
    <Dialog
      :hide-cancel-button="true"
      confirm-text="I Got It"
      title="Authorization Rejected"
      :is-show="isShowingRejectResultDialog"
      @click-confirm="onConfirmRejectResultClick">
      <div class="dialog-content mt-4">
        <div>
          We've sent an email to notify the dealer that they are “Not allowed to connect this bike”
          in the Dealer Portal.
        </div>
      </div>
    </Dialog>
    <Dialog
      :hide-cancel-button="true"
      confirm-text="I Got It"
      title="Successfully approved, await for bike reconnect"
      :is-show="isShowingAuthorizeResultDialog"
      @click-confirm="onConfirmAuthorizeResultClick">
      <div class="dialog-content mt-4">
        <div>
          We've sent an email to notify the dealer that they can reconnect the bike to the Dealer
          Portal.
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.bike-authorization-container {
  max-width: 720px;
  margin: 0 auto;
}

.divider {
  border-bottom: none;
}

.image {
  width: 150px;
  border-radius: 8px;
}

.field-title {
  font-weight: 500;
  min-width: 30%;
  line-height: 1.5;
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

.textarea-box:disabled {
  cursor: not-allowed;
}

.dialog-content-divider {
  border-bottom: 1px solid #e1e3df;
  margin: 0rem -24px;
}

.btn-reject {
  background-color: #ba1a1a;
  color: #ffffff;
}

:deep(.editable-label-box .text-on-background) {
  font-weight: 600;
}

:deep(.message-editable-label .editable-label-box) {
  border-bottom: none !important;
}

/* apply same box-shadow as tonal button */
.btn-reject:hover {
  box-shadow: 0 1px 2px #0000004d, 0 1px 3px 1px #00000026;
}

.reject-dialog :deep(.hy-dialog-title) {
  text-align: left;
}

.reject-dialog :deep(.el-dialog__footer) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  position: relative;
  top: 8px;
}

.reject-dialog :deep(.btn.btn-text) {
  border: 1px solid #e1e3df;
  margin-right: 10px;
}
</style>
