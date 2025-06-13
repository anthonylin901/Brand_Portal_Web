import type {
  ChangePasswordRequest,
  ConfirmForgotPasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  Configuration,
} from "hylink-auth-user-api-client"
import { defineStore } from "pinia"
import { storage } from "@/utils/local-storage"
import { Permissions } from "@/types/enums"
import { AuthApi } from "@/api/auth"
import { UserDetailType } from "@/types/auth"
import { useBikeStore } from "@/stores/use-bike-store"
import { useTeamMembersStore } from "@/stores/use-team-members-store"
import { usePostBundleStore } from "@/stores/use-post-bundle-store"
import { useCaseStore } from "@/stores/use-case-store"

type UserPermission = Partial<Record<Permissions, string>>

interface State {
  token?: Configuration["apiKey"]
  detail?: UserDetailType
  permission?: UserPermission
  isTeams?: boolean
}

export const useUserStore = defineStore("user", {
  state(): State {
    return {
      token: undefined,
      detail: undefined,
      permission: {},
      isTeams: storage.getIsTeams(),
    }
  },
  getters: {
    getUserFirstChar(): string | undefined {
      return this.detail?.username.charAt(0).toUpperCase()
    },
    getUserBrandIdList(): number[] {
      const brandId = this.detail?.attributes.brand_id
      const currentBrandId = Array.isArray(brandId) ? brandId : brandId ? [brandId] : [0]
      return currentBrandId.map(id => +id)
    },
  },
  actions: {
    async userLogin(loginRequest: LoginRequest): Promise<LoginResponse> {
      const result = await AuthApi.userLogin(loginRequest)
      this.token = result?.access_token
      return result
    },
    async verifyToken(token: Configuration["apiKey"]) {
      AuthApi.setToken(token)
      await AuthApi.verifyToken()
    },
    async setUserInfo(token: Configuration["apiKey"]) {
      const [userDetail, userPermission] = await Promise.all([
        AuthApi.getUserDetail(),
        AuthApi.getUserPermission(),
      ])
      this.token = token
      this.detail = userDetail
      this.permission = userPermission
    },
    async setIsTeams(value: boolean) {
      this.isTeams = value
      storage.setIsTeams(this.isTeams)
    },
    isSpecificRole(role: string): boolean {
      return this.detail?.roles.bps.includes(role) || false
    },
    canUserDo(action: Permissions): boolean {
      return !!this.permission && !!this.permission[action]
    },
    limitUserDo(action: Permissions): boolean {
      // can do: all
      return !!this.permission && this.permission[action] === "all"
    },
    logout() {
      storage.removeToken()
      storage.removeFrameNumber()
      storage.removeIsTeams()
      this.clearAllStore()
    },
    async changePassword(changePasswordInfo: ChangePasswordRequest) {
      return await AuthApi.changePassword(changePasswordInfo)
    },
    async resetPassword(resetPasswordInfo: ConfirmForgotPasswordRequest) {
      return await AuthApi.resetPassword(resetPasswordInfo)
    },
    async sendForgetPasswordEmail(email: ForgotPasswordRequest["username"]) {
      return await AuthApi.forgetPassword({
        username: email,
        platform: "bps",
      })
    },
    clearAllStore() {
      const bikeStore = useBikeStore()
      const postBundleStore = usePostBundleStore()
      const caseStore = useCaseStore()
      const teamMembersStore = useTeamMembersStore()
      bikeStore.$reset()
      postBundleStore.$reset()
      caseStore.$reset()
      teamMembersStore.$reset()
      this.$reset()
    },
  },
})
