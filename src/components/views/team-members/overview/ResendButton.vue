<script setup lang="ts">
import { Button, useLoading } from "hyena-design-system"
import { successAlert, errorAlert } from "@/utils/alert"

const { start } = useLoading()
import { resendTemporaryPassword } from "@/components/views/team-members/overview/team-members-overview"
const props = defineProps<{
  params: {
    email: string
  }
}>()

const resend = async() => {
  const stop = start(true)
  try {
    await resendTemporaryPassword(props.params.email)
    successAlert("Resent successfully")
  } catch {
    errorAlert("Failed")
  } finally {
    stop()
  }
}
</script>

<template>
  <div v-if="params.email">
    <Button type="filled" @click="resend">Resend Email</Button>
  </div>
</template>
