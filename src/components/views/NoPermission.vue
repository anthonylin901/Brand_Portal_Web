<script setup lang="ts">
import { Routes, ImageUrl } from "@/types/enums"
import { RouterLink } from "vue-router"

const { HyCatGif, HeaderLogo } = ImageUrl
</script>

<template>
  <div class="container bg-surface-variant no-permission-box">
    <div class="row flex-column">
      <nav class="bg-surface-variant p-4">
        <img :src="HeaderLogo" width="56" />
        <span class="fs-headline-lg lh-headline-lg fw-bold"> BP </span>
      </nav>

      <section class="ta-center m-auto">
        <div class="heading text-primary fw-bold">403</div>
        <div class="text-on-surface-variant fs-display lh-display fw-semi-bold py-3">
          No Permission
        </div>
        <img :src="HyCatGif" class="cat-gif" width="256" />
        <div class="text-on-surface lh-title py-3">
          <div>You do not have permission to access that.</div>
          <div>
            <RouterLink :to="{ name: Routes.Login }" class="go-back text-primary fw-bold">
              Go Back
            </RouterLink>
            <span>or refer to your system administrator (SW: Solar)</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.no-permission-box {
  height: 100vh;
}
.heading {
  font-size: 128px;
  line-height: 128px;
}

.go-back {
  text-decoration: none;
}
.cat-gif {
  border-radius: 24px;
}
</style>
