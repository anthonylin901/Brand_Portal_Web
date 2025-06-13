import { Configuration, BikeApiFactory } from "hyena-brand-portal-api-client"
import { getBrandPortalConfig, throwIfNotExist } from "@/api/config"

type BikeApi = ReturnType<typeof BikeApiFactory>

let _bikeApi: BikeApi | null = null

export const BikeServiceApi = {
  setToken(token: Configuration["apiKey"]) {
    const _brandPostConfig = getBrandPortalConfig(token)
    _bikeApi = BikeApiFactory(_brandPostConfig)
  },

  async getBikeInfo(frameNumber: string) {
    const response = await throwIfNotExist(_bikeApi).getBikeInformation(frameNumber)
    return response?.data.result
  },

  async getFirmwareUpdatedHistory(bikeId: string) {
    const response = await throwIfNotExist(_bikeApi).getFirmwareUpdates(bikeId)
    return response?.data.result
  },

  async getPartReplacementHistory(bikeId: string) {
    const response = await throwIfNotExist(_bikeApi).getPartReplacementHistory(bikeId)
    return response?.data.result
  },

  async getUnresolvedTaskList(frameNumber: string) {
    const response = await throwIfNotExist(_bikeApi).getUnresolvedTaskHistory(frameNumber)
    return response?.data.result
  },

  async getActivityTaskList(...arg: Parameters<BikeApi["getActivityHistory"]>) {
    const response = await throwIfNotExist(_bikeApi).getActivityHistory(...arg)
    return response?.data.result
  },
}
