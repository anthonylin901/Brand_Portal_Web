import { PartType } from "hyena-brand-portal-api-client"
import { TASK_COMMENT_ID_KEY } from "@/constants/bike-detail"

export enum SENSOR_DIAGNOSIS_PART {
  MEASUREMENT_SPEED = "measurement_speed",
  PEDAL_TORQUE_VALUE = "pedal_torque_value",
  PEDAL_RPM = "pedal_rpm"
}

export enum COMPONENT_CATEGORY {
  ControlAndDisplayUnit = "Control-and-display-unit",
  PowerSupply = "Power-supply",
  DriveUnit = "Drive-unit",
  Accessory = "Accessory",
}

export enum PART_INFO_KEY {
  PART_SPEC_ID = "partSpecId",
  SERIAL_NUMBER = "serialNumber"
}

export type ComponentInfo = {
  partSpecId?: string
  serialNumber?: string
  partType: PartType
  marketingName?: string
  isCommunication?: boolean
  partImg?: string
  isSparePart?: boolean
  spareOrder?: number
}

export type PART_REPLACEMENT_CONTENT = {
  added_serial_number: string
  removed_serial_number: string
  operation: string
}

export type RESCUED_BOOTLOADER_CONTENT = {
  serial_number: string
  new_firmware_version: string
}

export type ONLY_BARCODE_CONTENT = {
  serial_number: string
}

export type FIRMWARE_UPDATE_CONTENT = {
  serial_number: string
  new_firmware_version: string
  original_firmware_version: string
}

export type ACTIVATE_CONTENT = {
  activated_at: string
}

export type DIAGNOSIS_CONTENT = {
  status: boolean
}

export type ACTIVITY_COMMENT_CONTENT = {
  [TASK_COMMENT_ID_KEY]: string
}
