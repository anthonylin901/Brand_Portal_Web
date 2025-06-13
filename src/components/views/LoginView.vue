<script setup lang="ts">
import { PageFooter, AccountHeader, AccountLayout } from "hyena-design-system"
import LoginForm from "@/components/views/auth/login/LoginForm.vue"
import { storage } from "@/utils/local-storage"

storage.removeFrameNumber()
</script>

<template>
  <AccountLayout :is-has-background="true" class="h-100-vh">
    <AccountHeader />
    <LoginForm />
    <PageFooter />
  </AccountLayout>
</template>
