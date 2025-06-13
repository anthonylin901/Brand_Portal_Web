<script setup lang="ts">
import { Button } from "hyena-design-system"
import { useRouter } from "vue-router"
import { Routes } from "@/types/enums"
import { SEND_SUCCESS_IMAGE } from "@/constants/image"
const router = useRouter()
</script>
<template>
  <div class="text-center">
    <h3 class="fs-headline">Successfully invited</h3>
    <div class="fs-title fw-bold success-content">
      <p>
        We have sent an email to the user with a unique link to reset their password and log in.
      </p>
      You may see the newly user in the overview now.
    </div>
    <div class="mb-5">
      <img class="send-success-image" :src="SEND_SUCCESS_IMAGE" />
    </div>
    <Button type="filled" @click="router.push({ name: Routes.TeamMembersOverview })">
      Go To Overview
    </Button>
  </div>
</template>
<style scoped>
.success-content {
  width: 30rem;
  margin: 4rem auto;
}

.send-success-image {
  width: 5.875rem;
  height: 5.875rem;
}
</style>
