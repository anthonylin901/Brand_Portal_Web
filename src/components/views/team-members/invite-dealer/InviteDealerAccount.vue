<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue"
import {
  useLoading,
  FormGroup,
  Icon,
  Icons,
  Button,
  Select,
  Input,
  Variant,
  Dialog,
} from "hyena-design-system"
import { isValidEmail } from "@/utils/verify"
import { useRouter } from "vue-router"
import { Routes } from "@/types/enums"
import { inviteDealerAccount } from "@/components/views/team-members/invite-dealer/invite-dealer-account"
import {
  setBrandOptionList,
  setInvitableBrandList,
} from "@/components/views/team-members/team-members"
import { getInviteValidator } from "@/components/views/team-members/invite-dealer/validator"
import { teamMembersStore } from "@/stores"
import { AxiosError } from "axios"
import { ApiErrorCode } from "@/types/error"
import { errorAlert } from "@/utils/alert"

const Hyena_Dealer_Invite_Excel =
  "https://dps-storehouse.s3.us-east-1.amazonaws.com/Hyena_Dealer_Invite.xlsx"
const HYENA_EMAIL = "support@hyenatek.com"
const EMAIL_MAX_LENGTH = 100
const router = useRouter()
const { start } = useLoading()
const emailList = ref<string[]>([])
const currentEmail = ref<string>("")
const errorMessage = ref()
const confirmDialog = ref(false)
const brandID = ref<number | null>(null)
const regionList = ref<number[]>([])
const vInviteInfo$ = getInviteValidator(brandID, emailList)
const isEditEmail = ref(false)
const emailFiledError = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }
  return vInviteInfo$.value.emailList.$error ? vInviteInfo$.value.emailList.required.$message : ""
})

watch(currentEmail, () => {
  errorMessage.value = null
})

watch(brandID, () => {
  regionList.value = []
})

const isInputEmailVerified = computed(() => isEmailVerified(currentEmail.value))

const isEmailVerified = (email: string) => {
  if (!isValidEmail(email)) {
    errorMessage.value = "Please fill in valid email format."
    return false
  }
  if (isEmailDuplicate(email)) {
    errorMessage.value = "This email already exists in this form."
    return false
  }
  if (email.length > EMAIL_MAX_LENGTH) {
    errorMessage.value = `The email length can only be within ${EMAIL_MAX_LENGTH}.`
    return false
  }
  return true
}

const addEmail = () => {
  isEditEmail.value = true
  if (isEmailVerified(currentEmail.value)) {
    emailList.value.push(currentEmail.value)
    currentEmail.value = ""
    isEditEmail.value = false
  }
}

const removeEmail = (removeEmail: string) => {
  emailList.value = emailList.value.filter(email => email !== removeEmail)
}

const isEmailDuplicate = (checkEmail: string) => {
  return emailList.value.find(email => email === checkEmail)
}

const isBrandEmpty = computed(() => brandID.value === null)
const cancelCreate = () => {
  router.push({ name: Routes.TeamMembersOverview })
}

const invite = async () => {
  const stop = start(true)
  try {
    const inviteInfoVerified = await vInviteInfo$.value.$validate()
    if (inviteInfoVerified && brandID.value !== null) {
      await inviteDealerAccount(brandID.value, regionList.value, emailList.value)
      router.push({ name: Routes.SendEmailSuccess })
    }
  } catch (error) {
    // TODO 統整 api error handle
    if (
      error instanceof AxiosError &&
      error.response?.data?.code === ApiErrorCode.ParameterViolationException
    ) {
      errorAlert("Invite Email Failed (Brand is not allow to assign or Email is invalid)")
      return
    }
    throw error
  } finally {
    confirmDialog.value = false
    stop()
  }
}

const getRegionList = computed(() => {
  const match = teamMembersStore.invitableBrandList.find(brand => brand.id === brandID.value)
  const regions = match?.service_regions ?? []
  return regions.map(region => ({
    label: region.code,
    value: region.id,
  }))
})
onMounted(async () => {
  const stop = start(true)
  await Promise.all([setBrandOptionList(), setInvitableBrandList()]).finally(stop)
})
</script>
<template>
  <div class="invite-dealer-box container">
    <div class="flex justify-center">
      <div class="text-center">
        <h3 class="fs-headline text-on-background">Invite Dealer</h3>
        <div class="mb-4">
          Invite dealers to use the <b>Dealer Portal.</b> To add a service center,<br />please
          contact <a class="link" :href="`mailto:${HYENA_EMAIL}`">{{ HYENA_EMAIL }}</a>
        </div>
        <div class="text-center">
          <FormGroup class="text-left" title="Brand Access">
            <Select
              v-model="brandID"
              :option-list="teamMembersStore.getActiveBrandOptionList"
              :multiple="false"
              :is-error="vInviteInfo$.brandID.$error"
              :note="vInviteInfo$.brandID.$error ? vInviteInfo$.brandID.required.$message : ''"
              class="mt-4 mb-1"
              placeholder="Please select Brand"
              label="*Brand"
              filterable />
            <div class="fs-body-sm" style="text-indent: 1em">
              Assign one brand at a time. For multiple brands, send separate invites.
            </div>
            <Select
              v-model="regionList"
              :option-list="getRegionList"
              multiple
              class="mt-5 mb-1"
              placeholder="Please select Service Region"
              label="Service Region"
              :disabled="isBrandEmpty"
              filterable />
            <div
              class="fs-body-sm"
              style="text-indent: 1em"
              :class="{ 'text-gray': brandID === null }">
              Leave blank if none applies.
            </div>
            <hr class="divider my-5" />
            <div>
              <label class="fw-bold fs-title-lg">Invite Dealer</label>
              <div class="my-3 user-account-notice">
                We will send an email to the user with a unique link to reset their password and log
                in after ‘Invite’.
              </div>
              <div class="flex align-items-baseline">
                <Input
                  v-model="currentEmail"
                  class="mt-2 input-email"
                  label="*Email"
                  is-outlined
                  :variant="
                    (isEditEmail && (errorMessage || vInviteInfo$.emailList.$error)) ||
                    vInviteInfo$.emailList.$error
                      ? Variant.ERROR
                      : ''
                  "
                  :note="
                    vInviteInfo$.emailList.$error
                      ? 'Please fill in the required field.'
                      : isEditEmail
                      ? emailFiledError
                      : ''
                  "
                  placeholder="Please type Email"
                  @keyup.enter="addEmail()" />
                <Button
                  class="send-btn ml-1"
                  type="filled"
                  :disabled="!isInputEmailVerified"
                  @click="addEmail()">
                  Add</Button
                >
              </div>
              <div v-if="emailList.length > 0" class="flex justify-space-start badge-box">
                <div
                  v-for="email in emailList"
                  :key="email"
                  class="m-1 badge flex align-items-center">
                  <div>{{ email }}</div>
                  <Icon
                    class="fs-title-lg ml-2 mt-1 close-icon"
                    :icon="Icons.CLOSE"
                    @click="removeEmail(email)" />
                </div>
              </div>
            </div>
            <hr class="divider my-3" />
            <div class="flex align-items-center invite-notice">
              <Icon class="mr-2" :icon="Icons.INFO_FILLED" />
              <div>
                To invite multiple dealers in bulk, please download
                <a
                  class="link"
                  :href="Hyena_Dealer_Invite_Excel"
                  download="Hyena_Dealer_Invite_Excel.xlsx"
                  >Hyena Dealer Invite .xlsm</a
                >,<br />
                fill in and email it to
                <a class="link" :href="`mailto:${HYENA_EMAIL}`">{{ HYENA_EMAIL }}</a
                >. We will handle it for you.
              </div>
            </div>
          </FormGroup>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <div class="button-group py-3 bg-background">
        <div class="flex align-items-center justify-center">
          <Button type="outlined" class="mr-3" @click="cancelCreate">Cancel</Button>
          <Button type="filled" @click="confirmDialog = true">Invite</Button>
        </div>
      </div>
    </div>
    <Dialog
      title="Sure To Invite?"
      :is-show="confirmDialog"
      is-approve
      cancel-text="Back to Edit"
      confirm-text="Confirm"
      @click-cancel="confirmDialog = false"
      @click-confirm="invite">
      <div class="dialog-content">This action cannot be undone.</div>
    </Dialog>
  </div>
</template>
<style scoped>
.badge-box {
  width: 45rem;
}

.badge {
  padding: 6px 8px 6px 16px;
  border-radius: 0.5rem;
  border: 1px solid #707973;
}

.close-icon {
  cursor: pointer;
}

.user-account-notice {
  max-width: 45rem;
}

.button-group {
  width: 85vw;
  position: fixed;
  bottom: 0;
}

.input-email {
  flex: 1;
}

.send-btn {
  height: 2.5rem;
}

.invite-notice {
  color: #404944;
}

.link {
  color: #006c4d;
  font-weight: 500;
}
.text-gray {
  color: #191c1a;
  opacity: 38%;
}
</style>
