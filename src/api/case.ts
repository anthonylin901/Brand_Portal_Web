import { getBrandPortalConfig, throwIfNotExist } from "@/api/config"
import {
  Configuration,
  CaseManagementApiFactory,
  EnumerationApiFactory,
  BikeSpecApiFactory,
  UpdatePostBundleRequest,
  UpdateVerifyWorkspaceRequest,
  CaseType,
} from "hyena-brand-portal-api-client"

type CaseManagementApi = ReturnType<typeof CaseManagementApiFactory>
type EnumerationApi = ReturnType<typeof EnumerationApiFactory>
type BikeSpecApi = ReturnType<typeof BikeSpecApiFactory>

let _caseManagementApi: CaseManagementApi | null = null
let _enumerationApi: EnumerationApi | null = null
let _bikeSpecApi: BikeSpecApi | null = null

export const CaseManagementApi = {
  setToken(token: Configuration["apiKey"]) {
    const _brandPortalConfig = getBrandPortalConfig(token)
    _caseManagementApi = CaseManagementApiFactory(_brandPortalConfig)
    _enumerationApi = EnumerationApiFactory(_brandPortalConfig)
    _bikeSpecApi = BikeSpecApiFactory(_brandPortalConfig)
  },

  async getVerifyWorkspaceCaseOverview() {
    const response = await throwIfNotExist(_caseManagementApi).getCaseManagementList(
      CaseType.VerifyWorkspace
    )
    return response.data.result
  },

  async getVerifyWorkspaceCase(caseId: string) {
    const response = await throwIfNotExist(_caseManagementApi).getVerifyWorkspaceCaseById(caseId)
    return response.data.result
  },

  async getPostBundleCaseOverview() {
    const response = await throwIfNotExist(_caseManagementApi).getCaseManagementList(
      CaseType.PostBundle
    )
    return response.data.result
  },

  async updatePostBundleCase(id: string, params: UpdatePostBundleRequest) {
    const response = await throwIfNotExist(_caseManagementApi).updatePostBundleCase(id, params)
    return response.data.result
  },

  async handlePostBundleCase(id: string, params: UpdatePostBundleRequest) {
    const response = await throwIfNotExist(_caseManagementApi).handlePostBundleCase(id, params)
    return response.data.result
  },

  async handleVerifyWorkspaceCase(id: string, params: UpdateVerifyWorkspaceRequest) {
    const response = await throwIfNotExist(_caseManagementApi).handleVerifyWorkspaceCase(id, params)
    return response.data.result
  },

  async getBrandList() {
    const response = await throwIfNotExist(_enumerationApi).getBrandList()
    return response.data.result
  },

  async getBikeSpecList() {
    const response = await throwIfNotExist(_bikeSpecApi).getBikeSpecList()
    return response.data.result
  },

  async getBikeBundleRule(id: number) {
    const response = await throwIfNotExist(_bikeSpecApi).getBikeSpecBundleRule(id)
    return response.data.result
  },

  async getPostBundleCase(id: string) {
    const response = await throwIfNotExist(_caseManagementApi).getPostBundleCaseById(id)
    return response.data.result
  },
}
