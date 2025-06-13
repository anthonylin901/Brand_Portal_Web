import {
  Configuration,
  DealerSupportHubApiFactory,
  PostBundleApiFactory,
  BikeSpecApiFactory,
  EnumerationApiFactory,
  DealerCase,
} from "hyena-brand-portal-api-client"
import { getBrandPortalConfig, throwIfNotExist } from "@/api/config"

type DealerSupportHubApi = ReturnType<typeof DealerSupportHubApiFactory>
type PostBundleApi = ReturnType<typeof PostBundleApiFactory>
type BikeSpecApi = ReturnType<typeof BikeSpecApiFactory>
type EnumerationApi = ReturnType<typeof EnumerationApiFactory>

let _dealerSupportHubApi: DealerSupportHubApi | null = null
let _postBundleApi: PostBundleApi | null = null
let _bikeSpecApi: BikeSpecApi | null = null
let _enumerationApi: EnumerationApi | null = null

export const PostBundleApi = {
  setToken(token: Configuration["apiKey"]) {
    const _brandPostConfig = getBrandPortalConfig(token)
    _dealerSupportHubApi = DealerSupportHubApiFactory(_brandPostConfig)
    _postBundleApi = PostBundleApiFactory(_brandPostConfig)
    _bikeSpecApi = BikeSpecApiFactory(_brandPostConfig)
    _enumerationApi = EnumerationApiFactory(_brandPostConfig)
  },

  async getDealerSupportHubByCase(type: DealerCase) {
    const response = await throwIfNotExist(_dealerSupportHubApi).getDealerSupportHubList(type)
    return response.data.result
  },

  async getPostBundleOverview() {
    const response = await throwIfNotExist(_postBundleApi).getPostBundleOverview()
    return response.data.result
  },

  async getPostBundleByVerifyCode(verifyCode: string) {
    const response = await throwIfNotExist(_postBundleApi).getPostBundleByVerifyCode(verifyCode)
    return response.data.result
  },

  async getDealerSupportHub(id: number) {
    const response = await throwIfNotExist(_dealerSupportHubApi).getDealerSupportHubById(id)
    return response.data.result
  },

  async updateDealerSupportHub(...arg: Parameters<DealerSupportHubApi["updateDealerSupportHub"]>) {
    const response = await throwIfNotExist(_dealerSupportHubApi).updateDealerSupportHub(...arg)
    return response.data.result
  },

  // 這個 function 主要更新 DealerSupportHub case 為 processing
  async updateDealerSupportHubHandleCase(id: number) {
    const response = await throwIfNotExist(_dealerSupportHubApi).handleDealerSupportHub(id)
    return response.data.result
  },

  async getPostBundleBundleInfo(id: number) {
    const response = await throwIfNotExist(_postBundleApi).getPostBundleByDealerSupportHubById(id)
    return response.data.result
  },

  async updatePostBundle(...arg: Parameters<PostBundleApi["updatePostBundle"]>) {
    const response = await throwIfNotExist(_postBundleApi).updatePostBundle(...arg)
    return response.data.result
  },

  async createBike(id: number) {
    const response = await throwIfNotExist(_postBundleApi).createProductBikeByPostBundleBike(id)
    return response.data
  },

  async getBikeSpecList() {
    const response = await throwIfNotExist(_bikeSpecApi).getBikeSpecList()
    return response.data.result
  },

  async getBikeBundleRule(id: number) {
    const response = await throwIfNotExist(_bikeSpecApi).getBikeSpecBundleRule(id)
    return response.data.result
  },

  async getBrandList() {
    const response = await throwIfNotExist(_enumerationApi).getBrandList()
    return response.data.result
  },
}
