import { BikeServiceApi } from "@/api/bike"
import { EnumerationServiceApi } from "@/api/enumeration"
import { useEnumerationStore } from "@/stores/use-enumeration-store"
import { useBikeStore } from "@/stores/use-bike-store"
import { storage } from "@/utils/local-storage"

export const setBikeInfo = async (frameNumber: string) => {
  const bikeStore = useBikeStore()
  const bikeInfoData = await BikeServiceApi.getBikeInfo(frameNumber)
  bikeStore.setBikeInfo(bikeInfoData)
  storage.setFrameNumber(frameNumber)
}

export const setUnresolvedTaskList = async (frameNumber: string) => {
  const bikeStore = useBikeStore()
  const unresolvedTaskList = await BikeServiceApi.getUnresolvedTaskList(frameNumber)
  bikeStore.setUnresolvedTaskList(unresolvedTaskList.sort((a, b) => {
    return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
  }))
}

export const getActivityTaskList = async (frameNumber: string, startDate: string, endDate: string, page: number, pageSize: number) => {
  return await BikeServiceApi.getActivityTaskList(frameNumber, startDate, endDate, page, pageSize)
}

export const initBikeShopList = async () => {
  const enumerationStore = useEnumerationStore()
  if(enumerationStore.bikeShopList.length === 0) {
    const bikeShopList = await EnumerationServiceApi.getBikeShopList()
    enumerationStore.setBikeShopList(bikeShopList)
  }
}

export const initPartSpecList = async () => {
  const enumerationStore = useEnumerationStore()
  if(enumerationStore.partSpecList.length === 0) {
    const partSpecList = await EnumerationServiceApi.getPartSpecList()
    enumerationStore.setPartSpecList(partSpecList)
  }
}
