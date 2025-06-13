import { teamMembersStore } from "@/stores"

export const setBrandOptionList = async () => {
  await teamMembersStore.setBrandList()
}

export const setServiceCenterList = async () => {
  await teamMembersStore.setServiceCenterList()
}

export const setInvitableBrandList = async () => {
  await teamMembersStore.setInvitableBrandList()
}
