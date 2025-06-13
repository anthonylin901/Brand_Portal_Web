import { COMPONENT_CATEGORY } from "@/types/bike-history"
import { PartType } from "hyena-brand-portal-api-client"

export const APP_NAME = "Brand Portal"
export const NO_DATA = "No data"

// TODO: 依照規格更新
export const COMPONENT_CATEGORY_MAP: Record<string, string> = {
  [PartType.Hmi]: COMPONENT_CATEGORY.ControlAndDisplayUnit,
  [PartType.Battery]: COMPONENT_CATEGORY.PowerSupply,
  [PartType.RangeExtenderBattery]: COMPONENT_CATEGORY.PowerSupply,
  // [PartType.Charger]: COMPONENT_CATEGORY.PowerSupply,
  [PartType.MidMotor]: COMPONENT_CATEGORY.DriveUnit,
  [PartType.Controller]: COMPONENT_CATEGORY.DriveUnit,
  [PartType.Torque]: COMPONENT_CATEGORY.DriveUnit,
  [PartType.Motor]: COMPONENT_CATEGORY.DriveUnit,
  [PartType.SpeedSensor]: COMPONENT_CATEGORY.DriveUnit,
  [PartType.FrontLight]: COMPONENT_CATEGORY.Accessory,
  [PartType.RearLight]: COMPONENT_CATEGORY.Accessory,
  [PartType.Throttle]: COMPONENT_CATEGORY.Accessory,
  [PartType.Derailleur]: COMPONENT_CATEGORY.Accessory,
  [PartType.Lock]: COMPONENT_CATEGORY.Accessory,
}
