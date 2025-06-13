import { defineStore } from "pinia"
import type { Option } from "hyena-design-system"
import { TeamMembersApi } from "@/api/team-members"
import {
  Brand,
  ServiceCenter,
  InviteAccountRequest,
  Status,
  InvitableBrand,
} from "hyena-brand-portal-api-client"

interface State {
  brandList: Brand[]
  serviceCenterList: ServiceCenter[]
  invitableBrandList: InvitableBrand[]
}

export const useTeamMembersStore = defineStore("teamMembers", {
  state(): State {
    return {
      brandList: [],
      serviceCenterList: [],
      invitableBrandList: [],
    }
  },
  getters: {
    getBrandList(): State["brandList"] {
      return this.brandList
    },
    getActiveBrandOptionList(): Option[] {
      return this.brandList
        .filter(brand => brand.active === true)
        .map(brand => ({
          label: brand.name,
          value: brand.id,
        }))
    },
    getBrandIdMapList(): Map<number, string> {
      const list = new Map()
      this.brandList.forEach(brand => {
        list.set(brand.id, brand.name)
      })
      return list
    },
    getServiceCenterOptionList(): Option[] {
      return this.serviceCenterList.map(serviceCenter => ({
        label: serviceCenter.name,
        value: serviceCenter.id,
      }))
    },
    getServiceCenterIdMapList(): Map<number, string> {
      const list = new Map()
      this.serviceCenterList.forEach(serviceCenter => {
        list.set(serviceCenter.id, serviceCenter.name)
      })
      return list
    },
  },
  actions: {
    async inviteDealerAccount(inviteAccountRequest: InviteAccountRequest) {
      await TeamMembersApi.inviteDealerAccount(inviteAccountRequest)
    },
    async resendTemporaryPassword(email: string) {
      await TeamMembersApi.sendTemporaryPassword({ email })
    },
    async getDealerAccountOverview(
      page: number,
      pageSize: number,
      brandIdList?: number[],
      userName?: string,
      status?: Status
    ) {
      const result = await TeamMembersApi.getDealerAccountOverview(
        page,
        pageSize,
        userName,
        brandIdList,
        status
      )
      return result
    },
    async setBrandList() {
      if (this.brandList.length === 0) {
        this.brandList = await TeamMembersApi.getBrandList()
      }
    },
    async setServiceCenterList() {
      if (this.serviceCenterList.length === 0) {
        this.serviceCenterList = await TeamMembersApi.getServiceCenterList()
      }
    },
    async setInvitableBrandList() {
      if (this.invitableBrandList.length === 0) {
        this.invitableBrandList = await TeamMembersApi.getInvitableBrands()
      }
    },
  },
})
