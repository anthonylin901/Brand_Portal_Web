<script setup lang="ts">
import { AxiosError } from "axios"
import { onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useLoading, AccountHeader, AccountLayout, ChangePasswordForm } from "hyena-design-system"
import { APP_NAME } from "@/constants/common"
import { LOGO_URL } from "@/constants/image"
import { Routes } from "@/types/enums"
import { changePassword } from "@/components/views/auth/change-password/change-password"
import useChangePassword from "@/components/views/auth/use-change-password"
import { getAccessToken, initialApi } from "@/components/views/auth/login/login-form"
import { errorAlert, successAlert } from "@/utils/alert"
import { ApiErrorCode } from "@/types/error"
import { getApiErrorMessage, ApiFunctionName } from "@/errors/api-errors"
const route = useRoute()
const router = useRouter()
const { start } = useLoading()

const formDataInitialValue = {
  username: "",
  tempPassword: "",
  newPassword: "",
  confirmPassword: "",
}

const { formData, isNewPasswordPass, isConfirmPasswordPass, checkIfExpired } =
  useChangePassword(formDataInitialValue)

// ***首次登入更改密碼***
const handleChangeTempPassword = async () => {
  const stop = start(true)
  try {
    if (checkIfExpired()) {
      return handleExpired()
    }

    const { username, tempPassword, newPassword } = formData.value
    await changePassword(username, tempPassword, newPassword)
    await handleLogin(username, newPassword)
    successAlert("Successfully logged in.")
  } catch (error) {
    handleLoginError(error)
  } finally {
    stop()
  }
}

// ***首次更改密碼後自動登入***
const handleLogin = async (username: string, password: string) => {
  const access_token = await getAccessToken({ username, password })
  await handleTokenAndRedirect(access_token)
}

const handleTokenAndRedirect = async (token: string) => {
  await initialApi(token)
  router.push({ name: Routes.BikeHistory })
}

const handleLoginError = (error: unknown) => {
  // TODO error handle 慢慢茁壯
  if (error instanceof AxiosError && isUserNoPermissionError(error.response?.data.code)) {
    router.push({ name: Routes.NoPermission })
  } else {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.Login))
  }
}

const isUserNoPermissionError = (code: string) => {
  return code === ApiErrorCode.DisabledUserException || code === ApiErrorCode.UserNotExistException
}

// ***確認暫時密碼有無過期***
const handleCheckPass = () => {
  const { temp_password, username } = route.query as Record<string, string>
  formData.value.username = username
  formData.value.tempPassword = temp_password
}

const handleExpired = () => {
  router.push({ name: Routes.Login })
}

onMounted(() => {
  checkIfExpired() ? handleExpired() : handleCheckPass()
})
</script>

<template>
  <AccountLayout class="h-100-vh">
    <AccountHeader :middle-logo-src="LOGO_URL" :app-name="APP_NAME" />
    <ChangePasswordForm
      v-model:new-password.trim="formData.newPassword"
      v-model:confirm-password.trim="formData.confirmPassword"
      :is-new-password-pass="isNewPasswordPass"
      :is-confirm-password-pass="isConfirmPasswordPass"
      @handle-change-password="handleChangeTempPassword" />
  </AccountLayout>
</template>
