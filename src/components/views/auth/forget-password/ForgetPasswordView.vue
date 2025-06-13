<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import {
  useLoading,
  AccountHeader,
  AccountLayout,
  ForgetPasswordForm,
  ResendEmailForm,
} from "hyena-design-system"
import { LOGO_URL } from "@/constants/image"
import { APP_NAME } from "@/constants/common"
import { Routes } from "@/types/enums"
import { getUsernameValidator } from "@/components/views/auth/forget-password/validator"
import { sendForgetPasswordEmail } from "@/components/views/auth/forget-password/forget-password"
import { errorAlert } from "@/utils/alert"

const username = ref<string>("")
const isHasSent = ref(false)
const router = useRouter()
const { start } = useLoading()
const vUsername$ = getUsernameValidator(username)

const handleSendEmail = async () => {
  const stop = start(true)
  try {
    await sendForgetPasswordEmail(username.value)
    isHasSent.value = true
  } finally {
    stop()
  }
}

const sendEmail = async () => {
  vUsername$.value.$touch()
  if (!vUsername$.value.$invalid) {
    await handleSendEmail()
  } else {
    errorAlert(vUsername$.value.$errors[0]?.$message as string)
  }
}

const resendEmail = async () => {
  await handleSendEmail()
}
</script>

<template>
  <AccountLayout class="h-100-vh">
    <AccountHeader :app-name="APP_NAME" :middle-logo-src="LOGO_URL" />
    <ForgetPasswordForm
      v-if="!isHasSent"
      v-model.trim="username"
      :error-note="vUsername$.$errors[0]?.$message"
      :is-username-error="vUsername$.$error"
      @send-email="sendEmail"
      @back-to-login="router.push({ name: Routes.Login })" />
    <ResendEmailForm
      v-else
      :username="username"
      @resend-email="resendEmail"
      @back-to-login="router.push({ name: Routes.Login })" />
  </AccountLayout>
</template>
