<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import { LoginForm, useLoading } from "hyena-design-system"
import type { Configuration, LoginRequest } from "hylink-auth-user-api-client"
import { Routes } from "@/types/enums"
import { LOGO_URL } from "@/constants/image"
import { APP_NAME } from "@/constants/common"
import { getAccessToken, initialApi, setIsTeams } from "@/components/views/auth/login/login-form"
import { getApiErrorMessage, ApiFunctionName } from "@/errors/api-errors"
import { errorAlert } from "@/utils/alert"

const { start } = useLoading()
const router = useRouter()

defineProps<{
  appTitle?: string
}>()

const cognitoUrl = import.meta.env.VITE_COGNITO_URL

const loginRequest = reactive<LoginRequest>({
  username: "",
  password: "",
})

const login = async (queryAccessToken?: Configuration["apiKey"]) => {
  const stop = start("Loading...")
  try {
    const accessToken = queryAccessToken ?? (await getAccessToken(loginRequest))
    await initialApi(accessToken)
    router.push({ name: Routes.BikeHistory })
  } catch (error) {
    queryAccessToken
      ? router.push({ name: Routes.NoPermission })
      : errorAlert(getApiErrorMessage(error, ApiFunctionName.Login))
  } finally {
    stop()
  }
}

const handleMicrosoftLogin = async (token: string) => {
  const stop = start(true)
  try {
    await login(token)
    setIsTeams(true)
  } catch (error) {
    errorAlert(getApiErrorMessage(error, ApiFunctionName.Login))
  } finally {
    stop()
  }
}
</script>

<template>
  <LoginForm
    v-model:username.trim="loginRequest.username"
    v-model:password.trim="loginRequest.password"
    :microsoft-login-url="cognitoUrl"
    :title="APP_NAME"
    :logo-path="LOGO_URL"
    @handle-login="login"
    @handle-forget-password="router.push({ name: Routes.ForgetPassword })"
    @microsft-login-callback="handleMicrosoftLogin" />
</template>
