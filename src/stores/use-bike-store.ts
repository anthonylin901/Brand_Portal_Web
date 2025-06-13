import { defineStore } from "pinia"
import { BikeInformation, UnresolvedTaskHistory, ActivityHistoryInBikeEvent, ErrorCode } from "hyena-brand-portal-api-client"

interface State {
  currentBikeInfoData: BikeInformation | null
  unresolvedTaskList: UnresolvedTaskHistory[]
  activityTaskList: ActivityHistoryInBikeEvent[]
}

export const useBikeStore = defineStore("bike", {
  state(): State {
    return {
      currentBikeInfoData: null,
      unresolvedTaskList: [],
      activityTaskList: [],
    }
  },
  getters: {
    getSearchBikeInfo(): {
      currentBikeInfoData: State["currentBikeInfoData"]
    } {
      return {
        currentBikeInfoData: this.currentBikeInfoData,
      }
    },
    getHmiErrorCodeList(): ErrorCode[] {
      return (this.currentBikeInfoData?.error_code_in_hmi?.codes ?? []).sort((a, b) => {
        return b.odo - a.odo
      })
    }
  },
  actions: {
    setBikeInfo(bikeInfoData: BikeInformation) {
      this.currentBikeInfoData = bikeInfoData
    },
    setUnresolvedTaskList(unresolvedTaskList: UnresolvedTaskHistory[]) {
      this.unresolvedTaskList = unresolvedTaskList
    },
    setActivityTaskList(activityTaskList: ActivityHistoryInBikeEvent[]) {
      this.activityTaskList = activityTaskList
    },
  },
})
