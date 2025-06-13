import {
  BikeSpec,
  Brand,
  DealerSupportHubStatus,
  BundlePartType,
  AdditionalBundlePartType,
} from "hyena-brand-portal-api-client"

export enum COLUMNS_NAME {
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

export interface PostBundleOverviewList {
  [COLUMNS_NAME.BRAND]: string
  [COLUMNS_NAME.BIKE_MODEL]: string
  [COLUMNS_NAME.CREATED]: string
  [COLUMNS_NAME.UPDATED]: string
  [COLUMNS_NAME.VERIFY_CODE]: string
  [COLUMNS_NAME.HANDLER]?: string
  [COLUMNS_NAME.BIKE_SHOP]?: string
  [COLUMNS_NAME.FRAME_NUMBER]?: string
  [COLUMNS_NAME.STAGE]?: string
  [COLUMNS_NAME.ID]?: number
}

export type BikeSpecIdMap = {
  [key: number]: BikeSpec
}

export type BrandIdMap = {
  [key: number]: Brand
}

export type TagCellRendererParams = {
  [key: string]: DealerSupportHubStatus
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
