import { computed, ref, watch  } from "vue"
import { caseStore } from "@/stores"
import { defaultReporterContact } from "@/components/views/post-bundle-case/post-bundle-case"
import { defaultSerialNumberInfo } from "@/components/views/post-bundle/verify/verify-bike"
import { SerialNumberInfo, Category } from "@/types/post-bundle-type"
import {
  BrandPortalApiSchemaCaseManagementBikeShop,
  BundleRule,
  PostBundleCase,
  ReporterContact,
} from "hyena-brand-portal-api-client"
import { FRAME_NUMBER } from "@/components/views/post-bundle/verify/verify-bike"

const isInitializingData = ref(false)
const isLoadingBundleRule = ref(false)
const isLoading = computed(() => isInitializingData.value || isLoadingBundleRule.value)

const getFormSerialNumberInfo = (postBundleCase: PostBundleCase, bundleRule: BundleRule) => {
  const serialNumberInfo = JSON.parse(JSON.stringify(defaultSerialNumberInfo))

  bundleRule.protocol_parts.forEach(sameplePart => {
    serialNumberInfo[sameplePart.bundle_part_type].category = Category.PROTOCOL_PART
  })
  bundleRule.barcode_parts.forEach(sameplePart => {
    serialNumberInfo[sameplePart.bundle_part_type].category = Category.BARCODE_PART
  })

  serialNumberInfo[FRAME_NUMBER].value = postBundleCase.vin
  for (const partType in serialNumberInfo) {
    const part = serialNumberInfo[partType]
    if (part.category === Category.BARCODE_PART) {
      const barcodePart = postBundleCase.detail?.barcode_part_list.find(
        casePart => casePart.part_type === partType
      )
      part.value = barcodePart?.barcode ?? ""
    } else if (part.category === Category.PROTOCOL_PART) {
      const protocolPart = postBundleCase.detail?.protocol_part_list.find(
        casePart => casePart.part_type === partType
      )
      part.value = protocolPart?.barcode ?? ""
      part.partSpecId = protocolPart?.part_spec_id
    }
  }
  return serialNumberInfo
}

export const usePostBundleCaseVerify = (caseId: string) => {
  const {
    getPostBundleCase,
    setBikeSpecList,
    setBrandList,
    getBikeBundleRule,
    updatePostBundleCase,
    handlePostBundleCase,
  } = caseStore
  const postBundleCase = ref<PostBundleCase>()
  const formNote = ref<string>("")
  const bundleRule = ref<BundleRule>()
  const formBikeSpecId = ref<number>()
  const formBrandId = ref<number>()
  const formSerialNumberInfo = ref<SerialNumberInfo>(defaultSerialNumberInfo)
  const formBikeShop = ref<BrandPortalApiSchemaCaseManagementBikeShop>()
  const formReporterContact = ref<ReporterContact>(defaultReporterContact)

  watch(formBikeSpecId, async newValue => {
    if (newValue) {
      isLoadingBundleRule.value = true
      bundleRule.value = await getBikeBundleRule(newValue)
      if (postBundleCase.value) {
        formSerialNumberInfo.value = getFormSerialNumberInfo(postBundleCase.value, bundleRule.value)
      }
      isLoadingBundleRule.value = false
    }
  })

  watch(postBundleCase, () => {
    if (postBundleCase.value) {
      formBrandId.value = postBundleCase.value.bike_spec.brand_id
      formBikeSpecId.value = postBundleCase.value.bike_spec.id
      formBikeShop.value = postBundleCase.value.bike_shop
      formReporterContact.value = postBundleCase.value.reporter_contact
      formNote.value = postBundleCase.value.note || ""
    }
  })

  const initData = async () => {
    isInitializingData.value = true
    await setBikeSpecList()
    await setBrandList()
    postBundleCase.value = await getPostBundleCase(caseId)
    formBikeSpecId.value = postBundleCase.value?.bike_spec.id
    isInitializingData.value = false
  }

  return {
    initData,
    updatePostBundleCase,
    handlePostBundleCase,
    isLoading,
    postBundleCase,
    formSerialNumberInfo,
    bundleRule,
    formBrandId,
    formBikeSpecId,
    formBikeShop,
    formReporterContact,
    formNote,
  }
}
