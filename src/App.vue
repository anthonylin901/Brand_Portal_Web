<script setup lang="ts">
import { onMounted } from "vue"
import { RouterView } from "vue-router"
import { LoadingOverlay, useLoading } from "hyena-design-system"
import { AuthApi } from "@/api/auth"
import { PostBundleApi } from "@/api/post-bundle"
import { TeamMembersApi } from "@/api/team-members"
import { CaseManagementApi } from "@/api/case"
import { EnumerationServiceApi } from "@/api/enumeration"
import { BikeServiceApi } from "@/api/bike"
import { storage } from "@/utils/local-storage"

const { current } = useLoading()

onMounted(() => {
  const token = storage.getToken()
  AuthApi.setToken(token)
  if (token) {
    PostBundleApi.setToken(token)
    TeamMembersApi.setToken(token)
    CaseManagementApi.setToken(token)
    EnumerationServiceApi.setToken(token)
    BikeServiceApi.setToken(token)
  }
})
</script>

<template>
  <LoadingOverlay :content="current" />
  <RouterView />
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  display: block;
  overflow-x: hidden;
}
main {
  background-color: #e5efe9;
}
.hy-snackbar {
  white-space: nowrap;
  width: fit-content !important; /* use "!important" for current, need modify when sync to HDS */
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}

.h-100-vh {
  height: 100vh !important;
}

.divider {
  border: 1px solid rgba(225, 227, 223, 1);
}

.el-notification.hy-snackbar {
  background-color: #121212;

  .el-notification__group {
    margin-right: 21px;
  }

  &.text-error-dark {
    .el-notification__content {
      color: #f5544a;
    }

    .el-notification__closeBtn {
      color: #fff;
    }
  }

  .el-notification__content {
    color: #fff;
  }
}

.hy-tooltip {
  .hy-tooltip-content {
    width: 400px !important;
    padding: 8px !important;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    background-color: #2e312f !important;
    color: #fff !important;
  }
}

.hy-breadcrumb {
  li:not(:last-child) span {
    color: #191c1a;
  }
}

// Transition
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-leave-active {
  transition: opacity 0s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
