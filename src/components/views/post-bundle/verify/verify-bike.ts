import {
  PostBundle,
  BundlePartType,
  DealerSupportHub,
  UpdateDealerSupportHubRequest,
  OldUpdatePostBundleRequest,
  AdditionalBundlePartType,
  BundleRule,
} from "hyena-brand-portal-api-client"
import { postBundleStore } from "@/stores"
import {
  Category,
  SerialNumberInfo,
  LightConfiguration,
  ContactInfo,
} from "@/types/post-bundle-type"
import { Option } from "hyena-design-system"

export const FRAME_NUMBER = "frameNumber"

export const FormTitles = {
  ASSIGN_TO_BRAND: "Assign to Brand",
  VERIFY_BIKE_MODEL: "Verify Bike Model",
  VERIFY_PARTS_ON_THIS_BIKE: "Verify Parts on This Bike",
  LIGHT_CONFIRMATION: "Light Confirmation",
  CONTACT_INFO: "Contact Info.",
  NOTE: "Note",
}

export const lightRadioOptionList = [
  { label: "Yes", value: true },
  { label: "No", value: false },
]

export const defaultSerialNumberInfo: SerialNumberInfo = {
  [FRAME_NUMBER]: { value: "", category: Category.FRAME_NUMBER },
  [BundlePartType.Hmi]: {
    id: "",
    value: "",
    category: Category.PROTOCOL_PART,
    partSpecId: "",
  },
  [BundlePartType.Controller]: {
    id: "",
    value: "",
    category: Category.PROTOCOL_PART,
    partSpecId: "",
  },
  [BundlePartType.RangeExtenderBattery]: {
    id: "",
    value: "",
    category: Category.BARCODE_PART,
    partSpecId: "",
  },
  [BundlePartType.Battery]: {
    id: "",
    value: "",
    category: Category.BARCODE_PART,
    partSpecId: "",
  },
  [BundlePartType.Motor]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.Torque]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.Throttle]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.Display]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.Derailleur]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.Charger]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.CenterMotor]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.RearLight]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.FrontLight]: {
    value: "",
    category: Category.BARCODE_PART,
  },
  [BundlePartType.Cadence]: {
    value: "",
    category: Category.BARCODE_PART,
  },
}

export const defaultContactInfo: ContactInfo = {
  bikeShop: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  handlerMessage: "",
}

export const getPostBundleBundleInfo = async (id: number) => {
  return await postBundleStore.getPostBundleBundleInfo(id)
}

export const getSerialNumberInfo = (postBundleInfo: PostBundle) => {
  const serialNumberInfo = JSON.parse(JSON.stringify(defaultSerialNumberInfo))
  postBundleInfo.bundle.barcode_parts.forEach(part => {
    serialNumberInfo[part.bundle_part_type as BundlePartType].value = part.barcode ?? ""
    serialNumberInfo[part.bundle_part_type].category = Category.BARCODE_PART
  })
  postBundleInfo.bundle.protocol_parts.forEach(part => {
    // 同步 HST 通訊 part 顯示 MID
    serialNumberInfo[part.part_spec.type].id = part.id
    serialNumberInfo[part.part_spec.type].value = part.barcode
    serialNumberInfo[part.part_spec.type].category = Category.PROTOCOL_PART
    serialNumberInfo[part.part_spec.type].partSpecId = part.part_spec.id
  })
  serialNumberInfo[FRAME_NUMBER].value = postBundleInfo.vin
  return serialNumberInfo
}

export const getLightConfiguration = (
  additionalParts: AdditionalBundlePartType[]
): LightConfiguration => {
  return {
    front_light: additionalParts.includes(AdditionalBundlePartType.FrontLight),
    rear_light: additionalParts.includes(AdditionalBundlePartType.RearLight),
  }
}

export const getContactInfo = (dealerSupportHubInfo: DealerSupportHub): ContactInfo => {
  return {
    bikeShop: dealerSupportHubInfo.bike_shop,
    email: dealerSupportHubInfo.reporter_info.email,
    phone: dealerSupportHubInfo.reporter_info.phone,
    name: dealerSupportHubInfo.reporter_info.name,
    message: dealerSupportHubInfo.reporter_info.message,
    handlerMessage: dealerSupportHubInfo.handler_message,
  }
}

export const updatePostBundle = async (
  id: number,
  serialNumberInfo: SerialNumberInfo,
  lightConfiguration: LightConfiguration,
  bikeSpecId?: number
) => {
  const postBundleParams: OldUpdatePostBundleRequest = {
    bike_spec_id: bikeSpecId,
    bundle: {
      barcode_parts: [],
      additional_parts: [],
    },
    vin: serialNumberInfo[FRAME_NUMBER].value,
  }
  Object.entries(lightConfiguration).forEach(([key, value]) => {
    if (value) {
      postBundleParams.bundle?.additional_parts.push(key as AdditionalBundlePartType)
    }
  })
  Object.entries(serialNumberInfo).forEach(([key, { category, value }]) => {
    if (category === Category.BARCODE_PART && value) {
      const bundlePartType = key as BundlePartType
      postBundleParams.bundle?.barcode_parts.push({
        barcode: value,
        bundle_part_type: bundlePartType,
      })
    }
  })
  await postBundleStore.updatePostBundle(id, postBundleParams)
}

export const updateDealerSupportHub = async (
  id: number,
  brandId: number,
  contactInfo: ContactInfo
) => {
  const dealerSupportHubParams: UpdateDealerSupportHubRequest = {
    brand_id: brandId,
    bike_shop: contactInfo.bikeShop,
    reporter_info: {
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      message: contactInfo.message,
    },
    handler_message: contactInfo.handlerMessage,
  }
  await postBundleStore.updateDealerSupportHub(id, dealerSupportHubParams)
}

export const createBike = async (id: number) => {
  await postBundleStore.createBike(id)
}

export const updateDealerSupportHubHandleCase = async (id: number) => {
  await postBundleStore.updateDealerSupportHubHandleCase(id)
}

export const isEditablePart = (category: string) => {
  return category === Category.BARCODE_PART || category === Category.FRAME_NUMBER
}

export const getBundlePartList = (bundleRule: BundleRule) => {
  const bundlePartList: BundlePartType[] = []
  bundleRule.barcode_parts.forEach(barcodePart => {
    bundlePartList.push(barcodePart.bundle_part_type)
  })
  bundleRule.protocol_parts.forEach(protocolPart => {
    bundlePartList.push(protocolPart.bundle_part_type)
  })
  return bundlePartList
}

export const getBikeSpecByBrand = async (brandId?: number): Promise<Option[]> => {
  await postBundleStore.setBikeSpecList()
  const bikeSpecList = brandId
    ? postBundleStore.getBikeSpecList.filter(brand => brand.brand_id === brandId)
    : postBundleStore.getBikeSpecList
  return bikeSpecList.map(bikeSpec => {
    return {
      label: bikeSpec.name,
      value: bikeSpec.id,
    }
  })
}
