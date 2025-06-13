import {
  TaskRule,
  BrandPortalApiSchemaEnumerationBikeShop,
  ActivityHistoryName,
  InstructionI18n,
  PartType
} from "hyena-brand-portal-api-client"
import { transformPartLabelName, formatDate } from "@/utils/formatter"
import { TASK_NAME_MAP, TASK_ACTIVITY_MAP, COMMENT_TYPE_OPTION_MAP, TASK_COMMENT_ID_KEY } from "@/constants/bike-detail"
import { getActivityTaskList } from "@/utils/bike-detail"
import { useBikeStore } from "@/stores/use-bike-store"
import {
  PART_REPLACEMENT_CONTENT,
  RESCUED_BOOTLOADER_CONTENT,
  ONLY_BARCODE_CONTENT,
  FIRMWARE_UPDATE_CONTENT,
  ACTIVATE_CONTENT,
  DIAGNOSIS_CONTENT,
  ACTIVITY_COMMENT_CONTENT,
} from "@/types/bike-history"

export const getTaskName = (name: TaskRule, target: string, instructionList: InstructionI18n[]) => {
  const part = transformPartLabelName(target, true)
  switch (name) {
    case TaskRule.ErrorCodeDanger:
    case TaskRule.ErrorCodeWarning: {
      const instruction = instructionList.find(item => {
        return item.id === +target
      })
      return instruction
        ? `Error ${part} | ${instruction.category} ${instruction.error_type}`
        : `Error ${part} | unknown`
    }
    case TaskRule.PartBundleNotFound:
    case TaskRule.PartBundleNotMatch:
    case TaskRule.InBootloader:
    case TaskRule.MidNotFound:
    case TaskRule.IllegalMid:
    case TaskRule.FirmwareUpdateAvailable:
    case TaskRule.BundleRuleNotMatch:
    case TaskRule.ParameterNeedUpdate:
      return `${TASK_NAME_MAP[name]}: ${part}`
    default:
      return TASK_NAME_MAP[name]
  }
}

// refer: https://www.notion.so/19d7db130ef680cbaf8efbda03ceffb6
export const getActivityName = (
  name: ActivityHistoryName,
  instructionList: InstructionI18n[],
  context?: object,
  target?: string,
) => {
  const part = target ? transformPartLabelName(target, true) : "-"
  switch (name) {
    case ActivityHistoryName.ErrorCodeResolved: {
      const instruction = instructionList.find(item => {
        return item.id === +target!
      })
      return instruction
        ? `Resolved Error ${part} | ${instruction.category} ${instruction.error_type}`
        : `Resolved Error ${part} | unknown`
    }
    case ActivityHistoryName.BootloaderRescued:
      return `${TASK_ACTIVITY_MAP[name]} ${part} from Bootloader Mode`
    case ActivityHistoryName.MidParameterUpdate:
      return `${TASK_ACTIVITY_MAP[name]} ${part} ID to Local Device`
    case ActivityHistoryName.FirmwareUpdate:
      return `${TASK_ACTIVITY_MAP[name]} ${part} Firmware`
    case ActivityHistoryName.ParameterUpdate:
      return `${TASK_ACTIVITY_MAP[name]} ${part} Parameter`
    case ActivityHistoryName.BikeDiagnosis:
      if(target === PartType.Hmi) {
        return `Performed HMI Function Diagnosis`
      }
      return `Performed Sensor Function Diagnosis`
    case ActivityHistoryName.DiagnosisResolved:
      if(target === PartType.Hmi) {
        return `Resolved HMI Malfunction`
      }
      return `Resolved ${part} Sensor Issue`
    case ActivityHistoryName.PartReplacement: {
      const partReplacementDetail = context as PART_REPLACEMENT_CONTENT
      if(partReplacementDetail.operation === "INSTALL") {
        return `Added ${part} Accessory `
      } else if (partReplacementDetail.operation === "REMOVE") {
        return `Removed ${part} Accessory `
      }
      return `Replaced ${part}`
    }
    default:
      return TASK_ACTIVITY_MAP[name]
  }
}

export const getActivityContent = (
  name: string,
  context?: object,
  target?: string,
) => {
  const part = target ? transformPartLabelName(target, true) : "-"
  switch (name) {
    case ActivityHistoryName.PartReplacement: {
      const partReplacementDetail = context as PART_REPLACEMENT_CONTENT
      if(partReplacementDetail.operation === "INSTALL") {
        return `New accessory: ${part} ${partReplacementDetail.added_serial_number ? `SN ${partReplacementDetail.added_serial_number}` : ""}`
      } else if (partReplacementDetail.operation === "REMOVE") {
        return `Removed accessory: ${part} ${partReplacementDetail.added_serial_number ? `SN ${partReplacementDetail.added_serial_number}` : ""}`
      }
      return `${part} replaced from ${partReplacementDetail.removed_serial_number} to ${partReplacementDetail.added_serial_number}`
    }
    case ActivityHistoryName.BootloaderRescued: {
      const rescuedBootloaderDetail = context as RESCUED_BOOTLOADER_CONTENT
      return `${part} ${rescuedBootloaderDetail.serial_number ? `SN ${rescuedBootloaderDetail.serial_number}` : ""}: updated to ${rescuedBootloaderDetail.new_firmware_version}`
    }
    case ActivityHistoryName.MidParameterUpdate:
    case ActivityHistoryName.ParameterUpdate: {
      const barcodeDetail = context as ONLY_BARCODE_CONTENT
      return `${barcodeDetail.serial_number ? `${part} SN ${barcodeDetail.serial_number}` : "-"}`
    }
    case ActivityHistoryName.FirmwareUpdate: {
      const firmwareUpdateDetail = context as FIRMWARE_UPDATE_CONTENT
      let fwDetailContent = "firmware update executed (version unknown)"
      if (firmwareUpdateDetail.original_firmware_version && firmwareUpdateDetail.new_firmware_version) {
        fwDetailContent = `firmware updated ${firmwareUpdateDetail.original_firmware_version} to ${firmwareUpdateDetail.original_firmware_version}`
      } else if (firmwareUpdateDetail.original_firmware_version) {
        fwDetailContent = `firmware updated ${firmwareUpdateDetail.original_firmware_version} to (new version missing)`
      } else if (firmwareUpdateDetail.new_firmware_version) {
        fwDetailContent = `firmware updated to ${firmwareUpdateDetail.new_firmware_version}`
      }
      return `${part} ${ firmwareUpdateDetail.serial_number ? `SN ${firmwareUpdateDetail.serial_number}` : ""} : ${fwDetailContent}`
    }
    case ActivityHistoryName.ParameterCompare: {
      return "Parameter version check complete."
    }
    case ActivityHistoryName.BikeActivate: {
      const activateDetail = context as ACTIVATE_CONTENT
      return `Activation date: ${ activateDetail?.activated_at ? formatDate(activateDetail.activated_at, "DD MMM, YYYY") : "-"}`
    }
    case ActivityHistoryName.BikeConnected: {
      return "-"
    }
    case ActivityHistoryName.BikeDiagnosis: {
      const diagnosisDetail = context as DIAGNOSIS_CONTENT
      if(target === PartType.Hmi) {
        return diagnosisDetail.status ? "Diagnosis result: HMI is functioning properly"
        : "Diagnosis result: HMI failed"
      }
      return diagnosisDetail.status
        ? "Diagnosis result: sensor is functioning properly"
        : "Diagnosis result: sensor failed"
    }
    case ActivityHistoryName.ErrorCodeResolved:
    case ActivityHistoryName.DiagnosisResolved: {
      const commentDetail = context as ACTIVITY_COMMENT_CONTENT
      return `Dealer-selected activity: ${commentDetail?.[TASK_COMMENT_ID_KEY] ? COMMENT_TYPE_OPTION_MAP[commentDetail[TASK_COMMENT_ID_KEY]] : "N/A"}`
    }
    default:
      return
  }
}

export const getBikeShopName = (
  id: string,
  bikeShopList: BrandPortalApiSchemaEnumerationBikeShop[]
) => {
  const bikeShop = bikeShopList.find(shop => shop.id === id)
  return bikeShop ? bikeShop.name : "N/A"
}

export const appendActivityTaskList = async (...args: Parameters<typeof getActivityTaskList>) => {
  const bikeStore = useBikeStore()
  const activityTaskList = await getActivityTaskList(...args)
  const currentActivityTaskList = bikeStore.activityTaskList
    .concat(activityTaskList)
    .sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  bikeStore.setActivityTaskList(currentActivityTaskList)
}

export const resetActivityTaskList = () => {
  const bikeStore = useBikeStore()
  bikeStore.setActivityTaskList([])
}

export const isCommentActivity = (activityName: string) => {
  const commentActivityList: string[] = [ActivityHistoryName.ErrorCodeResolved, ActivityHistoryName.DiagnosisResolved]
  return commentActivityList.includes(activityName)
}
