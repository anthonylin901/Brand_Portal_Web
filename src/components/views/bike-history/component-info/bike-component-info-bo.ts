import {
  BrandPortalApiSchemaEnumerationPartSpec,
  BundlePartV2,
  BundleRuleV2,
  CommunicationProtocol,
  PartType,
} from "hyena-brand-portal-api-client"
import { bikeStore, enumerationStore } from "@/stores"
import { ComponentCardData } from "@/types/common"
import { COMPONENT_CATEGORY, PART_INFO_KEY } from "@/types/bike-history"
import { ComponentInfo } from "@/types/bike-history"
import { COMPONENT_CATEGORY_MAP } from "@/constants/common"
import batteryDefault from "@/assets/images/component-overview-default/default-battery.png"
import controllerDefault from "@/assets/images/component-overview-default/default-controller.png"
import hmiDefault from "@/assets/images/component-overview-default/default-hmi.png"
import lightDefault from "@/assets/images/component-overview-default/default-light.png"
import derailleurDefault from "@/assets/images/component-overview-default/default-derailleur.png"
import throttleDefault from "@/assets/images/component-overview-default/default-throttle.png"
import motorDefault from "@/assets/images/component-overview-default/default-motor.png"
import torqueDefault from "@/assets/images/component-overview-default/default-torque-sensor.png"
import midMotorDefault from "@/assets/images/component-overview-default/default-mid-motor.png"
import speedSensorDefault from "@/assets/images/component-overview-default/default-speed-sensor.png"
import lockDefault from "@/assets/images/component-overview-default/default-lock.png"
import chargeDefault from "@/assets/images/component-overview-default/default-charger.png"
import defaultImage from "@/assets/images/component-overview-default/default-img.svg"

const getBundleList = (
  bundle: BundlePartV2,
  partSpecList: BrandPortalApiSchemaEnumerationPartSpec[]
): ComponentInfo[] => {
  const list: ComponentInfo[] = []
  const { additional_parts = [], barcode_parts = [], protocol_parts = [] } = bundle
  const partList = [...barcode_parts, ...protocol_parts]
  partList.forEach(part => {
    const partInfo = partSpecList.find(partSpec => partSpec.id === part.part_spec_id)
    if (partInfo) {
      list.push({
        [PART_INFO_KEY.PART_SPEC_ID]: part.part_spec_id as string,
        [PART_INFO_KEY.SERIAL_NUMBER]: part.serial_number as string,
        partType: partInfo.part_type,
        marketingName: partInfo.marketing_name as string,
        isCommunication: partInfo.communication_protocol === CommunicationProtocol.Hap2,
        partImg: partInfo.part_image ?? getPartDefaultImage(partInfo.part_type),
      })
    } else if ("bundle_part_type" in part) {
      list.push({
        [PART_INFO_KEY.PART_SPEC_ID]: part.part_spec_id,
        [PART_INFO_KEY.SERIAL_NUMBER]: part.serial_number as string,
        partType: part.bundle_part_type as PartType,
        isCommunication: false,
        partImg: getPartDefaultImage(part.bundle_part_type as PartType),
      })
    }
  })
  return list.concat(
    additional_parts.map(part => ({ partType: part, partImg: getPartDefaultImage(part) }))
  )
}

const getBikeModelSpecList = (
  bundle: BundleRuleV2,
  partSpecList: BrandPortalApiSchemaEnumerationPartSpec[]
): ComponentInfo[] => {
  const list: ComponentInfo[] = []
  const { additional_parts = [], barcode_parts = [], protocol_parts = [] } = bundle
  const partList = [...barcode_parts, ...protocol_parts]
  partList.forEach(part => {
    part.part_spec_ids.forEach(partSpecId => {
      const partInfo = partSpecList.find(partSpec => partSpec.id === partSpecId)
      if (partInfo) {
        list.push({
          [PART_INFO_KEY.PART_SPEC_ID]: partSpecId,
          partType: partInfo.part_type,
          marketingName: partInfo.marketing_name as string,
          isCommunication: partInfo.communication_protocol === CommunicationProtocol.Hap2,
          partImg: partInfo.part_image ?? getPartDefaultImage(partInfo.part_type),
          isSparePart: part.part_spec_ids.length > 1,
          spareOrder: part.part_spec_ids.indexOf(partSpecId) + 1, // indexOf 取得陣列位置從 0 開始, 用於顯示UI 起始應為 1 因此 +1
        })
      }
    })
  })
  return list.concat(
    additional_parts.map(part => ({ partType: part, partImg: getPartDefaultImage(part) }))
  )
}

export const getComponentInfo = () => {
  const { currentBikeInfoData } = bikeStore.getSearchBikeInfo
  const partSpecList = enumerationStore.getPartSpecList
  return {
    currentBundleList: getBundleList(
      currentBikeInfoData?.latest_bundle as unknown as BundlePartV2,
      partSpecList
    ),
    productionBundleList: getBundleList(
      currentBikeInfoData?.production_bundle as unknown as BundlePartV2,
      partSpecList
    ),
    bikeModelSpecList: getBikeModelSpecList(
      currentBikeInfoData?.model.bundle_rule[0] as unknown as BundleRuleV2,
      partSpecList
    ),
  }
}

export const getPartList = (list: ComponentInfo[], category: COMPONENT_CATEGORY) => {
  return list
    .filter(part => COMPONENT_CATEGORY_MAP[part.partType] === category)
    .map(part => {
      const totalSparePartNum = list.filter(item => item.partType === part.partType).length
      const sparePartInfo = part.isSparePart
        ? {
            sparePartIndex: part.spareOrder,
            sparePartAmount: totalSparePartNum,
          }
        : null
      const infoList = Object.entries(part)
        .filter(([label, value]) => Object.values(PART_INFO_KEY as unknown as string[]).includes(label) && value)
        .map(([label, value]) => ({
          label: transformPartInfoLabel(label as PART_INFO_KEY),
          value,
        }))
      return {
        id: part.partSpecId,
        partType: part.partType,
        img: part.partImg,
        marketingName: part.marketingName,
        description: getPartDescription(part.partType),
        statusInfo: {
          isCommunication: part.isCommunication,
        },
        sparePartInfo,
        infoList,
      }
    }) as ComponentCardData[]
}

const transformPartInfoLabel = (label: PART_INFO_KEY) => {
  switch (label) {
    case PART_INFO_KEY.PART_SPEC_ID:
      return "Part Number"
    case PART_INFO_KEY.SERIAL_NUMBER:
      return "Serial Number"
    default:
      return ""
  }
}

const getPartDescription = (part?: PartType) => {
  const hasDescriptionPartList: string[] = [PartType.FrontLight, PartType.RearLight]
  if (part && hasDescriptionPartList.includes(part)) {
    return "No details for this accessory"
  }
}

export const getPartDefaultImage = (part?: PartType) => {
  switch (part) {
    case PartType.Battery:
    case PartType.RangeExtenderBattery:
      return batteryDefault
    case PartType.Derailleur:
      return derailleurDefault
    case PartType.Controller:
      return controllerDefault
    case PartType.Hmi:
      return hmiDefault
    case PartType.RearLight:
    case PartType.FrontLight:
      return lightDefault
    case PartType.Motor:
      return motorDefault
    case PartType.Torque:
      return torqueDefault
    case PartType.Throttle:
      return throttleDefault
    case PartType.MidMotor:
      return midMotorDefault
    case PartType.SpeedSensor:
      return speedSensorDefault
    case PartType.Lock:
      return lockDefault
    case PartType.Charger:
      return chargeDefault
    default:
      return defaultImage
  }
}
