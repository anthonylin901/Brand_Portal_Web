import { defineStore } from "pinia"
import { CaseManagementApi } from "@/api/case"
import { Option } from "hyena-design-system"
import {
  CaseManagementOverview,
  Brand,
  BikeSpec,
  CaseManagementStatus,
  PostBundleCase,
  VerifyWorkspaceCase,
  UpdateVerifyWorkspaceRequest,
  UpdatePostBundleRequest,
  BundleRule,
} from "hyena-brand-portal-api-client"

interface State {
  postBundleCaseList: CaseManagementOverview[]
  verifyWorkspaceCaseList: CaseManagementOverview[]
  brandList: Brand[]
  bikeSpecList: BikeSpec[]
}

export const useCaseStore = defineStore("case", {
  state(): State {
    return {
      postBundleCaseList: [],
      verifyWorkspaceCaseList: [],
      brandList: [],
      bikeSpecList: [],
    }
  },
  getters: {
    getBikeSpecList(): State["bikeSpecList"] {
      return this.bikeSpecList
    },
    getBikeSpecIdMap(): Record<number, BikeSpec> {
      return this.bikeSpecList.reduce((map, bikeSpec) => {
        map[bikeSpec.id] = bikeSpec
        return map
      }, {} as Record<number, BikeSpec>)
    },
    getBrandListIdMap(): Record<number, Brand> {
      return this.brandList.reduce((map, brand) => {
        map[brand.id] = brand
        return map
      }, {} as Record<number, Brand>)
    },
    getBrandList(): State["brandList"] {
      return this.brandList
    },
    getPostBundleCaseList(): State["postBundleCaseList"] {
      return this.postBundleCaseList
    },
    getVerifyWorkspaceCaseList(): State["verifyWorkspaceCaseList"] {
      return this.verifyWorkspaceCaseList
    },

    // Getter for UI options
    getPostBundleCaseFrameNumberFilterList(): Option[] {
      return this.postBundleCaseList.map(postBundleCase => {
        return { value: postBundleCase.vin }
      })
    },
    getVerifyWorkspaceCaseFrameNumberFilterList(): Option[] {
      return this.verifyWorkspaceCaseList.map(verifyWorkspaceCase => {
        return { value: verifyWorkspaceCase.vin }
      })
    },
    getBikeSpecNameList(): Option[] {
      return this.bikeSpecList.map(bikeSpec => {
        return { value: bikeSpec.name }
      })
    },
    getIdValuedBikeSpecNameList(): Option[] {
      return this.bikeSpecList.map(bikeSpec => {
        return { label: bikeSpec.name, value: bikeSpec.id }
      })
    },
    getBrandNameFilterList(): Option[] {
      return this.brandList.map(brand => {
        return { value: brand.name }
      })
    },
    getStatusFilterListForBikeAuthorization(): Option[] {
      return Object.values(CaseManagementStatus)
        .filter(status => status !== CaseManagementStatus.Processing)
        .map(status => {
          if (status === CaseManagementStatus.Rejected) {
            return { value: status, label: "Rejected" }
          }
          return { value: status }
        })
    },
    getStatusFilterListForPostBundleCase(): Option[] {
      return Object.values(CaseManagementStatus)
        .filter(status => status !== CaseManagementStatus.Rejected)
        .map(status => {
          return { value: status }
        })
    },
  },
  actions: {
    async getPostBundleCaseOverview(): Promise<CaseManagementOverview[]> {
      const result = await CaseManagementApi.getPostBundleCaseOverview()
      this.postBundleCaseList = result
      return result
    },
    async getPostBundleCase(caseId: string): Promise<PostBundleCase> {
      return await CaseManagementApi.getPostBundleCase(caseId)
    },
    async getVerifyWorkspaceCaseOverview(): Promise<CaseManagementOverview[]> {
      const result = await CaseManagementApi.getVerifyWorkspaceCaseOverview()
      this.verifyWorkspaceCaseList = result
      return result
    },
    async getVerifyWorkspaceCase(caseId: string): Promise<VerifyWorkspaceCase> {
      return await CaseManagementApi.getVerifyWorkspaceCase(caseId)
    },
    async handleVerifyWorkspaceCase(
      caseId: string,
      updateRequest: UpdateVerifyWorkspaceRequest
    ): Promise<VerifyWorkspaceCase> {
      return await CaseManagementApi.handleVerifyWorkspaceCase(caseId, updateRequest)
    },
    async getBikeBundleRule(bikeSpecId: number): Promise<BundleRule> {
      return await CaseManagementApi.getBikeBundleRule(bikeSpecId)
    },
    async updatePostBundleCase(
      caseId: string,
      updateRequest: UpdatePostBundleRequest
    ): Promise<PostBundleCase> {
      return await CaseManagementApi.updatePostBundleCase(caseId, updateRequest)
    },
    async handlePostBundleCase(caseId: string, updateRequest: UpdatePostBundleRequest) {
      return await CaseManagementApi.handlePostBundleCase(caseId, updateRequest)
    },
    async setBikeSpecList() {
      if (this.bikeSpecList.length === 0) {
        this.bikeSpecList = await CaseManagementApi.getBikeSpecList()
      }
    },
    async setBrandList() {
      if (this.brandList.length === 0) {
        this.brandList = await CaseManagementApi.getBrandList()
      }
    },
  },
})
