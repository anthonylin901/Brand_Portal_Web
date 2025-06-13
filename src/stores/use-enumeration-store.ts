import { defineStore } from "pinia"
import {
  BrandPortalApiSchemaEnumerationBikeShop,
  BrandPortalApiSchemaEnumerationPartSpec,
} from "hyena-brand-portal-api-client"

interface State {
  bikeShopList: BrandPortalApiSchemaEnumerationBikeShop[]
  partSpecList: BrandPortalApiSchemaEnumerationPartSpec[]
}

export const useEnumerationStore = defineStore("enumeration", {
  state(): State {
    return {
      bikeShopList: [],
      partSpecList: [],
    }
  },
  getters: {
    getBikeShopList(): State["bikeShopList"] {
      return this.bikeShopList
    },
    getPartSpecList(): State["partSpecList"] {
      return this.partSpecList
    },
  },
  actions: {
    setBikeShopList(bikeShopList: BrandPortalApiSchemaEnumerationBikeShop[]) {
      this.bikeShopList = bikeShopList
    },
    setPartSpecList(partSpecList: BrandPortalApiSchemaEnumerationPartSpec[]) {
      this.partSpecList = partSpecList
    },
  },
})
