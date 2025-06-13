import { TaskRule, ActivityHistoryName, ReportedSystem } from "hyena-brand-portal-api-client"

export const TASK_COMMENT_ID_KEY = "selected_activity_id"

export const PLATFORM_LABEL_MAP = {
  [ReportedSystem.HstV3]: "DP",
  [ReportedSystem.Hst]: "HST 2.0",
  [ReportedSystem.Hra]: "HRA"
  }

export const TASK_NAME_MAP: Record<TaskRule, string> = {
  [TaskRule.ErrorCodeDanger]: "Error",
  [TaskRule.ErrorCodeWarning]: "Error",
  [TaskRule.VinNotFound]: "Post-Bundle (Frame Number Missing)",
  [TaskRule.PartBundleNotMatch]: "Integrate New Component",
  [TaskRule.PartBundleNotFound]: "Integrate New Component",
  [TaskRule.InBootloader]: "Rescue Bootloader Mode",
  [TaskRule.IllegalMid]: "Sync Component ID",
  [TaskRule.MidNotFound]: "Authorize Component", // 尚未實作
  [TaskRule.FirmwareUpdateAvailable]: "Firmware Update",
  [TaskRule.ParameterNeedCompare]: "Check for Parameter Updates",
  [TaskRule.ParameterNeedUpdate]: "Update Parameters ",
  [TaskRule.PedalTorqueError]: "Check Torque Sensor",
  [TaskRule.MeasurementSpeedError]: "Check Speed Sensor",
  [TaskRule.PedalRpmError]: "Check Cadence Sensor",
  [TaskRule.BundleRuleNotMatch]: "Resolve Component Mismatch",
  [TaskRule.HmiNeedDiagnosis]: "HMI Malfunction",
}

export const TASK_ACTIVITY_MAP: Record<ActivityHistoryName, string> = {
  [ActivityHistoryName.PartReplacement]: "Replaced",
  [ActivityHistoryName.BootloaderRescued]: "Rescued",
  [ActivityHistoryName.MidParameterUpdate]: "Synced",
  [ActivityHistoryName.FirmwareUpdate]: "Updated",
  [ActivityHistoryName.ParameterUpdate]: "Updated",
  [ActivityHistoryName.ParameterCompare]: "Check for Parameter Version",
  [ActivityHistoryName.BikeActivate]: "Activated Bike",
  [ActivityHistoryName.BikeConnected]: "Connect E-Bike",
  [ActivityHistoryName.ErrorCodeResolved]: "Resolved Error",
  [ActivityHistoryName.BikeDiagnosis]: "Performed Function Diagnosis",
  [ActivityHistoryName.DiagnosisResolved]: "Performed Function Diagnosis",
}

export const COMMENT_TYPE_OPTION_MAP: Record<string, string> = {
  1: "Resolved by Replacing HMI",
  2: "Resolved by Replacing Controller",
  3: "Resolved by Replacing Battery",
  4: "Resolved by Replacing Battery Mounting Base",
  5: "Resolved by Replacing Charging Socket",
  6: "Resolved by Replacing Charger",
  7: "Resolved by Replacing Torque Sensor",
  8: "Resolved by Replacing Motor",
  9: "Resolved by Replacing Throttle",
  10: "Resolved by Replacing Extension Cable",
  11: "Resolved by Replacing Front Light",
  12: "Resolved by Replacing Rear Light",
  13: "Resolved by Repluging Connector",
  14: "Resolved by Rebooting E-bike",
  15: "Resolved by Charging Battery",
  16: "Resolved by Reinstalling Torque Sensor",
  17: "Resolved by Reinstalling Battery (Non-intube battery)",
  18: "Resolved by Fixing Dropped Chain",
  19: "Resolved by Cooling Down The E-bike",
  20: "Resolved by Turning Off Maintenance Notification",
  21: "Resolved by Resetting Maintenance Mileage",
  22: "Resolved by Firmware Updating",
  23: "Redo Diagnosis",
  24: "Others"
}
