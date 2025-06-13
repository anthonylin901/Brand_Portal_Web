import { createRouter, createWebHistory } from "vue-router"
import { Routes } from "@/types/enums"
import { Icons } from "hyena-design-system"
import { storage } from "@/utils/local-storage"
import { routes } from "@/router/routes"
import { useUserStore } from "@/stores/use-user-store"
declare module "vue-router" {
  interface RouteMeta {
    Icons?: Icons
    requiresToken: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  const { meta, name, fullPath } = to
  const userStore = useUserStore()
  if (meta.requiresToken && !storage.getToken()) {
    userStore.logout()
    return {
      name: Routes.Login,
      query: { redirect: fullPath },
    }
  }

  if (
    name === Routes.BikeHistory ||
    name === Routes.BikeHistorySearch ||
    name === Routes.BikeHistoryDetail
  ) {
    const currentFrameNumber = storage.getFrameNumber()

    if (currentFrameNumber) {
      return name === Routes.BikeHistoryDetail ? true : { name: Routes.BikeHistoryDetail }
    } else {
      return name === Routes.BikeHistorySearch ? true : { name: Routes.BikeHistorySearch }
    }
  }
})

export default router
