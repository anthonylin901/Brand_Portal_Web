<script setup lang="ts">
import { useRouter } from "vue-router"
import { useLoading, AccountHeader, AccountLayout, ChangePasswordForm } from "hyena-design-system"
import { APP_NAME } from "@/constants/common"
import { Routes } from "@/types/enums"
import { userStore } from "@/stores"
import { LOGO_URL } from "@/constants/image"
import { successAlert, errorAlert } from "@/utils/alert"
import useChangePassword from "@/components/views/auth/use-change-password"
import { changePassword } from "@/components/views/auth/change-password/change-password"
import { getApiErrorMessage, ApiFunctionName } from "@/errors/api-errors"

const { start } = useLoading()
const router = useRouter()
const formDataInitialValue = { currentPassword: "", newPassword: "", confirmPassword: "" }
const { formData, isNewPasswordPass, isConfirmPasswordPass } =
  useChangePassword(formDataInitialValue)

const handleChangePassword = async () => {
  const stop = start(true)
  try {
    const { currentPassword, newPassword } = formData.value
    const username = userStore.detail?.username || ""
    await changePassword(username, currentPassword, newPassword)
    successAlert("Password changed successfully. Please login again.")
    logout()
  } catch (error) {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.ResetPassword))
  } finally {
    stop()
  }
}

const logout = () => {
  userStore.logout()
  router.push({ name: Routes.Login })
}
</script>

<template>
  <AccountLayout class="h-100-vh">
    <AccountHeader :middle-logo-src="LOGO_URL" :app-name="APP_NAME" />
    <ChangePasswordForm
      v-model:currentPassword.trim="formData.currentPassword"
      v-model:newPassword.trim="formData.newPassword"
      v-model:confirmPassword.trim="formData.confirmPassword"
      :is-need-current-password="true"
      :is-new-password-pass="isNewPasswordPass"
      :is-confirm-password-pass="isConfirmPasswordPass"
      :is-show-go-back="true"
      @handle-change-password="handleChangePassword"
      @go-back="router.go(-1)" />
  </AccountLayout>
</template>
