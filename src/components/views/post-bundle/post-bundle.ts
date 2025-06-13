import { postBundleStore, userStore } from "@/stores"

export const HYENA_BRAND = 2

export const Message = {
  REQUIRE_FILED: "Please filled the required field",
  SELECT_BRAND: "Please Select Brand",
  No_BRAND: "There is no Brand",
  INVALID_VALUE: "Invalid value",
  INCOMPATIBLE_BIKE_MODEL: "Incompatible with Bike Model.",
  INVALID_VERIFY_CODE: "Invalid code, please try again.",
  VERIFY_CODE_TAKEN: "This code has already been taken by other brands.",
  SAVE_SUCCESS: "Successfully saved.",
}

export const getPostBundleByVerifyCode = async (verifyCode: string) => {
  return await postBundleStore.getPostBundleByVerifyCode(verifyCode)
}

export const getDealerSupportHub = async (id: number) => {
  return await postBundleStore.getDealerSupportHub(id)
}

export const getCurrentBrandIdList = () => {
  return userStore.getUserBrandIdList
}

export const getBundleRule = async (id: number) => {
  return postBundleStore.getBundleRule(id)
}

export const getBikeSpec = async () => {
  await postBundleStore.setBikeSpecList()
  return postBundleStore.bikeSpecList
}

export const getBrandList = async () => {
  await postBundleStore.setBrandList()
  return postBundleStore.brandList
}
