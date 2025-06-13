<script setup lang="ts">
import PageHeader from "@/components/blocks/layout/PageHeader.vue"
import { ref, onMounted } from "vue"
import { RouteLocation, RouterView, useRoute, useRouter } from "vue-router"
import { Routes, PageTitle, Permissions } from "@/types/enums"
import {
  Sidebar,
  SidebarUserInfo,
  SidebarSection,
  SidebarLink,
  useLoading,
  Dialog,
} from "hyena-design-system"
import { storage } from "@/utils/local-storage"
import { userStore, instructionStore } from "@/stores"
import { getUTCTimeZone, getUserNameByEmail } from "@/utils/formatter"
import { LOGO_URL } from "@/constants/image"
import { version } from "../../../package.json"

const { start } = useLoading()
const isCollapse = ref(false)
const router = useRouter()
const currentRoute = useRoute()
const accessToken = storage.getToken()
const isLogoutDialogShow = ref<boolean>(false)

const getLinkProps = (name: Routes) => {
  const location = router.resolve({ name })
  return {
    icon: location.meta?.icon,
    isActive: isCurrentRouteMatch(location),
    isMini: isCollapse.value,
    onClick: () => router.push(location),
  }
}

const isCurrentRouteMatch = (location: RouteLocation) => {
  const currentMatches = currentRoute.matched.map(route => route.path)
  const locationPath = location.path.split("/")[1]
  return currentMatches.includes(`/${locationPath}`)
}

const verifyToken = async () => {
  try {
    await userStore.verifyToken(accessToken)
  } catch (err) {
    userStore.logout()
    router.push({ name: Routes.Login })
  }
}

const logout = () => {
  userStore.logout()
  router.push({ name: Routes.Login })
  isLogoutDialogShow.value = false
}

onMounted(async () => {
  const stop = start("Getting User Information...")
  await verifyToken()
  await Promise.all([
    userStore.setUserInfo(accessToken),
    instructionStore.getInstruction(),
  ]).finally(stop)
})
</script>

<template>
  <Suspense>
    <template #fallback>
      <div></div>
    </template>
    <main class="main-container">
      <Sidebar
        title="BP"
        class="left"
        :version-tag="`v${version}`"
        :img-src="LOGO_URL"
        :is-collapse="isCollapse"
        @collapse="isCollapse = !isCollapse">
        <SidebarUserInfo
          :is-show-change-password="!userStore.isTeams"
          :is-mini="isCollapse"
          :prefix="getUserNameByEmail(userStore.detail?.username || '')"
          :username="userStore.detail?.username || ''"
          :time="getUTCTimeZone()"
          @change-password="router.push({ name: Routes.ChangePassword })"
          @logout="isLogoutDialogShow = true" />
        <SidebarSection class="sidebar-section" :is-collapsed="isCollapse" :no-divider="true">
          <SidebarLink :label="PageTitle.BikeHistory" v-bind="getLinkProps(Routes.BikeHistory)" />
          <SidebarLink
            :label="PageTitle.PostBundle"
            v-bind="getLinkProps(Routes.PostBundleOverview)" />
          <SidebarLink
            :label="PageTitle.PostBundleCase"
            v-bind="getLinkProps(Routes.PostBundleCaseOverview)" />
          <SidebarLink
            :label="PageTitle.BikeAuthorization"
            v-bind="getLinkProps(Routes.BikeAuthorizationOverview)" />
          <SidebarLink
            v-if="userStore.canUserDo(Permissions.GET_DEALER_ACCOUNT)"
            :label="PageTitle.TeamMembers"
            v-bind="getLinkProps(Routes.TeamMembersOverview)" />
        </SidebarSection>
      </Sidebar>
      <!-- Main content -->
      <div class="container flex flex-column right col">
        <PageHeader />
        <div class="main-content">
          <RouterView />
        </div>
      </div>
      <!-- /Main content -->
      <Dialog
        :is-show="isLogoutDialogShow"
        title="Logout"
        @click-cancel="isLogoutDialogShow = false"
        @click-confirm="logout">
        Are you sure you want to logout?
      </Dialog>
    </main>
  </Suspense>
</template>
<style scoped>
:root {
  --collapse-padding: 0.6875rem;
  --collapse-negative-padding: -0.6875rem;
}

main > .right {
  position: relative;
  width: min-content;
}
.main-container {
  display: flex;
  flex-wrap: nowrap;
}

.main-container .collapse {
  width: 5.4375rem;
  padding-left: var(--collapse-padding);
  padding-right: var(--collapse-padding);
}

.main-container .collapse > .hy-sidebar-user-info {
  padding-left: var(--collapse-padding);
  padding-right: var(--collapse-padding);
  margin-left: var(--collapse-negative-padding);
  margin-right: var(--collapse-negative-padding);
}

main > .left {
  padding: 1rem;
  width: 16rem;
}

main > .left :deep(.hy-sidebar-user-info-wrapper) {
  flex-flow: nowrap;
}

main > .left :deep(.hy-sidebar-user-info-wrapper .user-name) {
  max-width: 9rem;
}

main > .left :deep(.hy-sidebar-user-info-wrapper .hy-icon) {
  margin-left: 0;
}

.sidebar-section > .section-items:not(:last-child) {
  margin-bottom: 0.25rem;
}
</style>
