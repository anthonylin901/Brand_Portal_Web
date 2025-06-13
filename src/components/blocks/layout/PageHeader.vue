<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import BikeHistorySearchBar from "@/components/blocks/bike-history/BikeHistorySearchBar.vue"
import { Button, BreadCrumb, useLoading } from "hyena-design-system"
import { Routes, PageTitle, Permissions } from "@/types/enums"
import { useUserStore } from "@/stores/use-user-store"
import { useBikeStore } from "@/stores/use-bike-store"
import { bikeHistoryPageList, postBundlePageList } from "@/constants/layout"
import { PATH } from "@/constants/router"
import { capitalizeWords, dashToSpace } from "@/utils/formatter"
import { setBikeInfo, setUnresolvedTaskList } from "@/utils/bike-detail"
import { errorAlert, successAlert } from "@/utils/alert"

const router = useRouter()
const route = useRoute()
const { start } = useLoading()
const userStore = useUserStore()
const bikeStore = useBikeStore()
const isBikeNotFound = ref(false)
const isHeaderSticky = computed(() => !route.fullPath.includes(PATH.BIKE_HISTORY))

const currentPageTitle = computed(() => {
  const { name } = route

  if (bikeHistoryPageList.includes(name as Routes)) {
    return PageTitle.BikeHistory
  } else if (postBundlePageList.includes(name as Routes)) {
    return PageTitle.PostBundle
  } else if (name === Routes.TeamMembersOverview) {
    return PageTitle.TeamMembers
  } else if (name === Routes.InviteDealerAccount || name === Routes.SendEmailSuccess) {
    return "Invite Dealer"
  } else if (name === Routes.BikeAuthorizationOverview) {
    return PageTitle.BikeAuthorization
  } else if (name === Routes.PostBundleCaseOverview) {
    return PageTitle.PostBundleCase
  } else if (name === Routes.PostBundleCaseVerify) {
    return PageTitle.PostBundleCaseVerify
  } else if (name === Routes.BikeHistoryComponentInfo) {
    return PageTitle.ComponentInfo
  }
  return ""
})

const currentFrameNumber = computed(() => bikeStore.currentBikeInfoData?.vin ?? "-")

const isInBikeHistory = computed(() => route.name === Routes.BikeHistoryDetail)
const isInVerifyWorkspace = computed(() => route.name === Routes.BikeAuthorizationDetail)
const isInPostBundleCaseVerify = computed(() => route.name === Routes.PostBundleCaseVerify)

const isShowPostBundleButton = computed(() => {
  return (
    route.name === Routes.PostBundleOverview &&
    userStore.canUserDo(Permissions.VIEW_ADD_POST_BUNDLE)
  )
})

const isShowInviteDealerButton = computed(
  () =>
    route.name === Routes.TeamMembersOverview &&
    userStore.canUserDo(Permissions.CREATE_DEALER_ACCOUNT)
)

const breadCrumbPath = computed(() => {
  switch (route.name) {
    case Routes.BikeHistory:
    case Routes.BikeHistoryDetail:
    case Routes.BikeHistorySearch:
      return capitalizeWords(dashToSpace(PATH.BIKE_HISTORY))
    case Routes.BikeHistoryComponentInfo:
      return `${capitalizeWords(dashToSpace(PATH.BIKE_HISTORY))}/${capitalizeWords(
        dashToSpace(PATH.BIKE_HISTORY_COMPONENT_INFO)
      )}`
    case Routes.PostBundleOverview:
      return capitalizeWords(dashToSpace(PATH.POST_BUNDLE))
    case Routes.PostBundleCaseOverview:
      return capitalizeWords(dashToSpace(PATH.POST_BUNDLE_CASE))
    case Routes.PostBundleCaseVerify:
      return `${capitalizeWords(dashToSpace(PATH.POST_BUNDLE_CASE))}/Detail`
    case Routes.VerifyCode:
    case Routes.VerifyBike:
    case Routes.BrandCheck:
      return `${capitalizeWords(dashToSpace(PATH.POST_BUNDLE))}/${capitalizeWords(
        dashToSpace("post-bundle Bike")
      )}`
    case Routes.TeamMembers:
    case Routes.TeamMembersOverview:
      return capitalizeWords(dashToSpace(PATH.TEAM_MEMBERS))
    case Routes.InviteDealerAccount:
    case Routes.SendEmailSuccess:
      return `${capitalizeWords(dashToSpace(PATH.TEAM_MEMBERS))}/Invite Dealer`
    case Routes.BikeAuthorization:
    case Routes.BikeAuthorizationOverview:
      return capitalizeWords(dashToSpace(PATH.BIKE_AUTHORIZATION))
    case Routes.BikeAuthorizationDetail:
      return `${capitalizeWords(dashToSpace(PATH.BIKE_AUTHORIZATION))}/Detail`
    default:
      return ""
  }
})

const handleCrumbClick = (clickedPath: string) => {
  switch (clickedPath) {
    case capitalizeWords(dashToSpace(PATH.POST_BUNDLE)):
      router.push({ name: Routes.PostBundleOverview })
      break
    case capitalizeWords(dashToSpace(PATH.TEAM_MEMBERS)):
      router.push({ name: Routes.TeamMembersOverview })
      break
    case capitalizeWords(dashToSpace(PATH.POST_BUNDLE_CASE)):
      router.push({ name: Routes.PostBundleCaseOverview })
      break
    case capitalizeWords(dashToSpace(PATH.BIKE_AUTHORIZATION)):
      router.push({ name: Routes.BikeAuthorizationOverview })
      break
    case capitalizeWords(dashToSpace(PATH.BIKE_HISTORY)):
      router.push({ name: Routes.BikeHistoryDetail })
      break
  }
}

const searchBikeInfo = async (frameNumber: string) => {
  isBikeNotFound.value = false
  const stop = start("Searching Bike Information...")
  try {
    await setBikeInfo(frameNumber)
    await setUnresolvedTaskList(frameNumber)
    successAlert("Bike found successfully.")
  } catch{
    isBikeNotFound.value = true
    errorAlert("Bike not found, please search another Frame Number")
  } finally {
    stop()
  }
}
</script>

<template>
  <div class="hy-page-header header-box" :style="{ position: isHeaderSticky ? 'sticky' : 'unset' }">
    <div class="top flex mb-2">
      <div class="header-title">
        <BreadCrumb :path="breadCrumbPath" @crumb-clicked="handleCrumbClick" />
      </div>
    </div>
    <div class="bottom flex">
      <div v-if="isInBikeHistory && bikeStore.currentBikeInfoData !== null">
        <span class="frame-number-title">Frame Number</span>
        <span class="current-page-title">{{ currentFrameNumber }}</span>
      </div>
      <div v-else-if="isInPostBundleCaseVerify || isInVerifyWorkspace">
        <div id="page-header-teleport"></div>
      </div>
      <div v-else>
        <span class="current-page-title">{{ currentPageTitle }}</span>
      </div>
      <Button
        v-if="isShowPostBundleButton"
        type="filled"
        @click="router.push({ name: Routes.VerifyCode })">
        + Post-bundle Bike
      </Button>
      <Button
        v-else-if="isShowInviteDealerButton"
        type="filled"
        @click="router.push({ name: Routes.InviteDealerAccount })">
        + Invite Dealer
      </Button>
      <BikeHistorySearchBar
        v-if="
          isInBikeHistory && bikeStore.currentBikeInfoData !== null
        "
        is-show-default-frame-number
        :is-error="isBikeNotFound"
        @search-frame-number="searchBikeInfo" />
    </div>
  </div>
</template>

<style scoped>
.header-title {
  font-size: 1rem;
  width: auto;
  color: #006c4d;
  font-weight: 400;
  position: relative;
}
.my-account {
  z-index: 1000000;
  position: absolute;
  right: 3.7rem;
  top: 2.8rem;
  border-radius: 5px;
  border: 1px solid #f0f0f0;
  -webkit-box-shadow: 0 24px 54px rgb(0 0 0 / 15%), 0 4.5px 13.5px rgb(0 0 0 / 8%);
  box-shadow: 0 24px 54px rgb(0 0 0 / 15%), 0 4.5px 13.5px rgb(0 0 0 / 8%);
  padding: 1rem;
  background-color: #ffffff;
  text-align: center;
}
.logout-box:hover {
  cursor: pointer;
  transition: 0.3s all ease;
  color: #006c4d;
}
.top {
  justify-content: space-between;
}
.bottom {
  justify-content: space-between;
  margin-bottom: 10px;
}
.frame-number-title {
  font-size: 1rem;
  font-weight: 700;
}
.current-page-title {
  display: block;
  font-size: 2.8rem;
  font-weight: 700;
}
.account-avatar {
  background-color: #3e6374;
  color: #ffffff;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.2s all ease;
}
.account-avatar:hover {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.9);
  transition: 0.2s all ease;
}
@media only screen and (max-width: 1200px) {
  .my-account {
    right: 1rem;
  }
  .header-box {
    height: 7rem;
    padding: 15px 1rem;
  }
  .frame-number-title {
    font-size: 0.8rem;
  }
  .current-page-title {
    font-size: 2rem;
  }
}
</style>
