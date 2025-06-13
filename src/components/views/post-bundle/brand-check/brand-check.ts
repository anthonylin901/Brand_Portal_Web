import { UpdateDealerSupportHubRequest } from "hyena-brand-portal-api-client"
import { postBundleStore, userStore } from "@/stores"
import { getBrandList } from "@/components/views/post-bundle/post-bundle"
import { Option } from "hyena-design-system"
import { Permissions } from "@/types/enums"

export const updateDealerSupportHubBrand = async (id: number, brandId: number) => {
  const dealerSupportHubParams: UpdateDealerSupportHubRequest = {
    brand_id: brandId,
    reporter_info: {},
  }
  await postBundleStore.updateDealerSupportHub(id, dealerSupportHubParams)
}

export const getUserBrandList = async (userBrandIdList: number[]): Promise<Option[]> => {
  const brandList = await getBrandList()
  return brandList
    .filter(brand => {
      return userBrandIdList.includes(brand.id)
    })
    .map(brand => ({
      label: brand.name,
      value: brand.id,
    }))
}

// 只有VIEW_ADD_POST_BUNDLE為all(詢問後端先用字串)的人可以拿到所有BrandId
export const getAllBrandIdList = async (): Promise<number[]> => {
  if (userStore.permission?.[Permissions.HANDLE_DEALER_SUPPORT_HUB] === "all") {
    const brandList = await getBrandList()
    return brandList.map(brand => brand.id)
  }
  return []
}
