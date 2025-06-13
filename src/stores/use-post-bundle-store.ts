import { defineStore } from "pinia"
import type { Option } from "hyena-design-system"
import { PostBundleApi } from "@/api/post-bundle"
import {
  PostBundleOverview,
  UpdateDealerSupportHubRequest,
  DealerSupportHub,
  BikeSpec,
  OldUpdatePostBundleRequest,
  DealerCase,
  DealerSupportHubOverview,
  Brand,
  PostBundle,
} from "hyena-brand-portal-api-client"

interface State {
  postBundleList: PostBundleOverview[]
  postBundleDealerSupportHubList: DealerSupportHubOverview[]
  bikeSpecList: BikeSpec[]
  brandList: Brand[]
}

export const usePostBundleStore = defineStore("postBundle", {
  state(): State {
    return {
      postBundleList: [],
      postBundleDealerSupportHubList: [],
      bikeSpecList: [],
      brandList: [],
    }
  },
  getters: {
    getBikeSpecList(): State["bikeSpecList"] {
      return this.bikeSpecList
    },
    getBrandList(): State["brandList"] {
      return this.brandList
    },
    // 只讓使用者可選到active的(表示與Hyena有合作 by Rolye)
    getBrandOptionList(): Option[] {
      return this.brandList
        .filter(brand => brand.active)
        .map(brand => ({
          label: brand.name,
          value: brand.id,
        }))
    },
    getBikeSpecNameList(): Option[] {
      return this.bikeSpecList.map(bikeSpec => {
        return { value: bikeSpec.name }
      })
    },
    getBrandNameFilterList(): Option[] {
      return this.brandList.map(brand => {
        return { value: brand.name }
      })
    },
    getFrameNumberFilterList(): Option[] {
      return this.postBundleList.map(postBundle => {
        return { value: postBundle.vin }
      })
    },
    getVerifyCodeFilterList(): Option[] {
      return this.postBundleList.map(postBundle => {
        return { value: postBundle.verify_code }
      })
    },
  },
  actions: {
    async getPostBundleDealerSupportHub(): Promise<DealerSupportHubOverview[]> {
      const result = await PostBundleApi.getDealerSupportHubByCase(DealerCase.PostBundle)
      this.postBundleDealerSupportHubList = result
      return result
    },

    async getPostBundleOverview(): Promise<PostBundleOverview[]> {
      const result = await PostBundleApi.getPostBundleOverview()
      this.postBundleList = result
      return result
    },

    async getPostBundleByVerifyCode(verifyCode: string): Promise<PostBundle> {
      const result = await PostBundleApi.getPostBundleByVerifyCode(verifyCode)
      return result
    },

    async getDealerSupportHub(id: number): Promise<DealerSupportHub> {
      const result = await PostBundleApi.getDealerSupportHub(id)
      return result
    },

    async updateDealerSupportHub(
      id: number,
      dealerSupportHubParams: UpdateDealerSupportHubRequest
    ) {
      return PostBundleApi.updateDealerSupportHub(id, dealerSupportHubParams)
    },

    async updateDealerSupportHubHandleCase(id: number) {
      return PostBundleApi.updateDealerSupportHubHandleCase(id)
    },

    async getPostBundleBundleInfo(id: number) {
      return await PostBundleApi.getPostBundleBundleInfo(id)
    },

    async updatePostBundle(id: number, postBundleParams: OldUpdatePostBundleRequest) {
      return PostBundleApi.updatePostBundle(id, postBundleParams)
    },

    async createBike(id: number) {
      return PostBundleApi.createBike(id)
    },

    async setBikeSpecList() {
      if (this.bikeSpecList.length === 0) {
        this.bikeSpecList = await PostBundleApi.getBikeSpecList()
      }
    },

    async setBrandList() {
      if (this.brandList.length === 0) {
        this.brandList = await PostBundleApi.getBrandList()
      }
    },

    async getBundleRule(id: number) {
      return await PostBundleApi.getBikeBundleRule(id)
    },
  },
})
