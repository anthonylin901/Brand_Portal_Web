import { Configuration, EnumerationApiFactory } from "hyena-brand-portal-api-client"
import { getBrandPortalConfig, throwIfNotExist } from "@/api/config"

type EnumerationApi = ReturnType<typeof EnumerationApiFactory>

let _enumerationApi: EnumerationApi | null = null

export const EnumerationServiceApi = {
  setToken(token: Configuration["apiKey"]) {
    const _brandPostConfig = getBrandPortalConfig(token)
    _enumerationApi = EnumerationApiFactory(_brandPostConfig)
  },

  async getBikeShopList() {
    const response = await throwIfNotExist(_enumerationApi).getBikeShopList()
    return response.data.result
  },

  async getPartSpecList() {
    const response = await throwIfNotExist(_enumerationApi).getPartSpecList()
    return response.data.result
  },
}
