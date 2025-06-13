import { teamMembersStore } from "@/stores"

export const inviteDealerAccount = async (
  brandID: number,
  service_region_ids: number[],
  emailList: string[]
) => {
  const payload = {
    brand_id: brandID,
    service_region_ids: service_region_ids,
    emails: emailList,
  }
  await teamMembersStore.inviteDealerAccount(payload)
}
