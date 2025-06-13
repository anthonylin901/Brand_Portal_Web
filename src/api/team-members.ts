import { Configuration, AuthApiFactory, EnumerationApiFactory } from "hyena-brand-portal-api-client"
import { getBrandPortalConfig, throwIfNotExist } from "@/api/config"

type EnumerationApi = ReturnType<typeof EnumerationApiFactory>
type AuthApi = ReturnType<typeof AuthApiFactory>

let _enumerationApi: EnumerationApi | null = null
let _authApi: AuthApi | null = null

export const TeamMembersApi = {
  setToken(token: Configuration["apiKey"]) {
    const _brandPostConfig = getBrandPortalConfig(token)
    _enumerationApi = EnumerationApiFactory(_brandPostConfig)
    _authApi = AuthApiFactory(_brandPostConfig)
  },

  async getBrandList() {
    const response = await throwIfNotExist(_enumerationApi).getBrandList()
    return response.data.result
  },

  async getServiceCenterList() {
    const response = await throwIfNotExist(_enumerationApi).getServiceCenterList()
    return response.data.result
  },

  async inviteDealerAccount(...arg: Parameters<AuthApi["inviteDealerAccount"]>) {
    const response = await throwIfNotExist(_authApi).inviteDealerAccount(...arg)
    return response.data
  },

  async sendTemporaryPassword(...arg: Parameters<AuthApi["resendTemporaryPassword"]>) {
    const response = await throwIfNotExist(_authApi).resendTemporaryPassword(...arg)
    return response.data
  },

  async getDealerAccountOverview(...arg: Parameters<AuthApi["queryDealerAccountOverview"]>) {
    const response = await throwIfNotExist(_authApi).queryDealerAccountOverview(...arg)
    return response.data
  },

  async getInvitableBrands(...arg: Parameters<AuthApi["getInvitableBrands"]>) {
    const response = await throwIfNotExist(_authApi).getInvitableBrands(...arg)
    return response.data.result
  },
}
