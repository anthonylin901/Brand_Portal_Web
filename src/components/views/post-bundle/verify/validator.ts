import { Ref, computed } from "vue"
import { useVuelidate, Validation } from "@vuelidate/core"
import { email, required } from "@vuelidate/validators"
import {
  BundlePartType,
  BundleRule,
  ProtocolPartSpecs,
  BarcodePartSpecs,
} from "hyena-brand-portal-api-client"
import { FRAME_NUMBER } from "@/components/views/post-bundle/verify/verify-bike"
import { Category, SerialNumberInfo, ContactInfo } from "@/types/post-bundle-type"

// charger特規可以為空
const isChargerEmpty = (value: string) => {
  return value === ""
}

const isProtocolPartCorrect = (
  part: BundlePartType,
  protocolPartSpecs: ProtocolPartSpecs[],
  partSpecId: string
) => {
  const result = protocolPartSpecs
    .find(protocolPart => {
      return protocolPart.bundle_part_type === part
    })
    ?.part_spec_list.filter(partSpec => {
      return partSpecId.includes(partSpec)
    })
  return result ? result.length > 0 : false
}

const isBarcodePartCorrect = (
  value: string,
  part: BundlePartType,
  barcodeParts: BarcodePartSpecs[]
) => {
  const result = barcodeParts
    .find(barcodeParts => {
      return barcodeParts.bundle_part_type === part
    })
    ?.part_spec_list.find(partSpec => {
      const legalRule = partSpec.barcode_rules.find(rule => {
        return new RegExp(rule.regular_expression).test(value)
      })
      return !!legalRule
    })
  return !!result
}

const isValidatedNumber = (value: number) => {
  return value !== 0
}

export const getSerialNumberValidator = (
  serialNumberInfo: Ref<SerialNumberInfo>,
  bundleRule: Ref<BundleRule | undefined>,
  bundlePartList: Ref<BundlePartType[]>
): Ref<Validation> => {
  const checkFrameNumberRule = (value: string) => {
    if (bundleRule) {
      const isHasVerified = bundleRule.value?.vin_rules.find(rule => {
        const pattern = new RegExp(rule.regular_expression)
        return pattern.test(value)
      })
      return value !== "" && isHasVerified
    }
  }

  const checkPartRule = (part: BundlePartType) => (value: string) => {
    // Charger 特規判斷, 不為空才驗證規則
    if (part === BundlePartType.Charger && isChargerEmpty(value)) {
      return true
    }
    if (bundleRule) {
      return serialNumberInfo.value[part].category === Category.PROTOCOL_PART
        ? bundleRule.value?.protocol_parts
          ? isProtocolPartCorrect(
              part,
              bundleRule.value?.protocol_parts,
              serialNumberInfo.value[part].partSpecId ?? ""
            )
          : false
        : bundleRule.value?.barcode_parts
        ? isBarcodePartCorrect(value, part, bundleRule.value?.barcode_parts)
        : false
    }
    return true
  }

  const rule = computed(() => {
    const result = {
      [FRAME_NUMBER]: {
        value: { required, checkFrameNumberRule },
      },
      [BundlePartType.Hmi]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Hmi),
        },
      },
      [BundlePartType.Controller]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Controller),
        },
      },
      [BundlePartType.Battery]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Battery),
        },
      },
      [BundlePartType.Motor]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Motor),
        },
      },
      [BundlePartType.Torque]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Torque),
        },
      },
      [BundlePartType.Charger]: {
        value: {
          checkPartRule: checkPartRule(BundlePartType.Charger),
        },
      },
      [BundlePartType.Display]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Display),
        },
      },
      [BundlePartType.Derailleur]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.Derailleur),
        },
      },
      [BundlePartType.CenterMotor]: {
        value: {
          required,
          checkPartRule: checkPartRule(BundlePartType.CenterMotor),
        },
      },
    }
    // 把不在bundle part內的規則移除
    Object.keys(result).forEach(part => {
      if (!bundlePartList.value.includes(part as BundlePartType) && part !== FRAME_NUMBER) {
        delete result[part as keyof typeof result]
      }
    })
    return result
  })
  return useVuelidate(rule, serialNumberInfo)
}

export const getContactInfoValidator = (contactInfo: Ref<ContactInfo>): Ref<Validation> => {
  const rule = {
    bikeShop: { required },
    name: { required },
    email: { required, email },
    phone: { required },
  }
  return useVuelidate(rule, contactInfo)
}

export const getOptionValidator = (
  brandId: Ref<number | undefined>,
  bikeSpecId: Ref<number | undefined>
): Ref<Validation> => {
  const option = {
    brandId,
    bikeSpecId,
  }
  const rule = {
    brandId: { required, isValidatedNumber },
    bikeSpecId: { required, isValidatedNumber },
  }
  return useVuelidate(rule, option)
}
