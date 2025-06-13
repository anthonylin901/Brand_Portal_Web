import {
  BikeSpec,
  Brand,
  CaseManagementStatus,
  BundlePartType,
  AdditionalBundlePartType,
} from "hyena-brand-portal-api-client"

export enum COLUMNS_NAME {
  CASE_ID = "case_id",
  BRAND = "Brand",
  BIKE_MODEL = "Bike Model",
  FRAME_NUMBER = "Frame Number",
  BIKE_SHOP = "Bike Shop",
  STAGE = "Stage",
  CREATED = "Created",
  UPDATED = "Updated",
  HANDLER = "Handler",
  ID = "id",
  VERIFY_CODE = "Verification Code",
}

export enum Category {
  FRAME_NUMBER = "frame_number",
  BARCODE_PART = "barcode_part",
  PROTOCOL_PART = "protocol_part",
}

export interface PostBundleCaseOverviewList {
  [COLUMNS_NAME.ID]: string
  [COLUMNS_NAME.BRAND]: string
  [COLUMNS_NAME.BIKE_MODEL]: string
  [COLUMNS_NAME.CREATED]: string
  [COLUMNS_NAME.UPDATED]: string
  [COLUMNS_NAME.HANDLER]?: string
  [COLUMNS_NAME.BIKE_SHOP]?: string
  [COLUMNS_NAME.FRAME_NUMBER]?: string
  [COLUMNS_NAME.STAGE]?: string
}

export type BikeSpecIdMap = {
  [key: number]: BikeSpec
}

export type BrandIdMap = {
  [key: number]: Brand
}

export type TagCellRendererParams = {
  [key: string]: CaseManagementStatus
}

export type SerialNumberFiled = {
  value: string
  category: Category
  id?: string
  partSpecId?: string
}

export type SerialNumberInfo = {
  frameNumber: SerialNumberFiled
} & Record<BundlePartType, SerialNumberFiled>

export type LightConfiguration = {
  [key in AdditionalBundlePartType]: boolean
}

export type ContactInfo = {
  bikeShop: string
  name: string
  email: string
  phone: string
  message?: string
  handlerMessage?: string
}
