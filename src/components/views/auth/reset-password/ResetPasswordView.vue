<script setup lang="ts">
import { Routes } from "@/types/enums"
import { onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useLoading, AccountHeader, AccountLayout, ChangePasswordForm } from "hyena-design-system"
import { LOGO_URL } from "@/constants/image"
import { APP_NAME } from "@/constants/common"
import { resetPassword } from "@/components/views/auth/reset-password/reset-password"
import useChangePassword from "@/components/views/auth/use-change-password"
import { errorAlert, successAlert } from "@/utils/alert"

const route = useRoute()
const router = useRouter()
const { start } = useLoading()

const formDataInitialValue = {
  username: "",
  newPassword: "",
  confirmPassword: "",
  confirmationCode: "",
}

const { formData, isNewPasswordPass, isConfirmPasswordPass, checkIfExpired } =
  useChangePassword(formDataInitialValue)

const handleResetPassword = async () => {
  const { username, newPassword, confirmationCode } = formData.value
  const stop = start(true)
  try {
    if (checkIfExpired()) {
      return handleExpired()
    }

    await resetPassword(username, newPassword, confirmationCode)
    successAlert("Password changed successfully. Please login again.")
    router.push({ name: Routes.Login })
  } finally {
    stop()
  }
}

const handleCheckPass = () => {
  const query = route.query as Record<string, string>
  formData.value.username = query.username
  formData.value.confirmationCode = query.confirmation_code
}

const handleExpired = () => {
  router.push({ name: Routes.ForgetPassword })
  errorAlert("The verification code has expired. Please try again.")
}

onMounted(() => {
  checkIfExpired() ? handleExpired() : handleCheckPass()
})
</script>

<template>
  <AccountLayout class="h-100-vh">
    <AccountHeader :app-name="APP_NAME" :middle-logo-src="LOGO_URL" />
    <ChangePasswordForm
      v-model:new-password.trim="formData.newPassword"
      v-model:confirm-password.trim="formData.confirmPassword"
      title="Password Reset"
      :is-new-password-pass="isNewPasswordPass"
      :is-confirm-password-pass="isConfirmPasswordPass"
      @handle-change-password="handleResetPassword" />
  </AccountLayout>
</template>

<style scoped></style>
