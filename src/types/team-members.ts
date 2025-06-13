import { Pagination } from "@/types/table"

export enum ACTIVE_STATUS {
  active = "Active",
  Inactive = "Inactive",
  unconfirmed = "Pending Acceptance",
}

export enum COLUMNS_NAME {
  USER_ACCOUNT = "User Account",
  BRAND = "Brand",
  SERVICE_CENTER = "Service Center",
  ACTIVE_STATUS = "Active Status",
  RESEND_EMAIL = "Resend Email"
}

export type DealerAccount = {
  [COLUMNS_NAME.USER_ACCOUNT]: string
  [COLUMNS_NAME.BRAND]: number[]
  // [COLUMNS_NAME.SERVICE_CENTER]: number[] // 先註解, 目前後端架構先不需要 SERVICE_CENTER By Asa
  [COLUMNS_NAME.ACTIVE_STATUS]: ACTIVE_STATUS
}

export type DealerAccountOverview = {
  dealerAccountList: DealerAccount[]
  pagination: Pagination
}

export type BrandListRenderParams = {
  [key: string]: number[]
}

export type ServiceCenterListRenderParams = {
  [key: string]: number[]
}

export type ActiveStatusRenderParams = {
  [key: string]: ACTIVE_STATUS
}

export type EmailParams = {
  [key: string]: string
}
