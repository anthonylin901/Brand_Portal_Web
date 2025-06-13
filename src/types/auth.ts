import type { UserDetail } from "hylink-auth-user-api-client"

export type UserDetailType = {
  attributes: DetailAttributes
  roles: UserRole
} & UserDetail

type DetailAttributes = {
  brand_id: number | number[]
}

type UserRole = {
  bps: string[]
}
