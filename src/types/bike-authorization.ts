import { BikeSpec, Brand, CaseManagementStatus } from "hyena-brand-portal-api-client"

export enum COLUMNS_NAME {
  ID = "id",
  BRAND = "Brand",
  BIKE_MODEL = "Bike Model",
  FRAME_NUMBER = "Frame Number",
  BIKE_SHOP = "Bike Shop",
  STAGE = "Stage",
  CREATED = "Created",
  UPDATED = "Updated",
  HANDLER = "Handler",
}

export interface BikeAuthorizationCaseOverviewList {
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
