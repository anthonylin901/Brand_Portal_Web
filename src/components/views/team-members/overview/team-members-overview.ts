// *** 先註解 SERVICE_CENTER 相關, 目前後端架構先不需要 By Asa ***
import type { EmitFilterChanged } from "hyena-design-system"
import { DealerAccountOverview } from "@/types/team-members"
import { COLUMNS_NAME, ACTIVE_STATUS } from "@/types/team-members"
import { teamMembersStore } from "@/stores"
import { Status } from "hyena-brand-portal-api-client"

export const getDealerAccountOverview = async (
  page: number,
  pageSize: number,
  filterList?: EmitFilterChanged["filterModel"]
): Promise<DealerAccountOverview> => {
  let filterBrandList: number[] = [],
    // filterServiceCenterList: number[] = [],
    filterUserName,
    filterStatus
  if (filterList) {
    const {
      brandList,
      // serviceCenterList,
      userName,
      status,
    } = getFilterList(filterList)
    filterBrandList = brandList
    // filterServiceCenterList = serviceCenterList
    filterUserName = userName
    filterStatus = status
  }
  const dealerAccountOverview = await teamMembersStore.getDealerAccountOverview(
    page,
    pageSize,
    filterBrandList,
    filterUserName,
    filterStatus
  )
  const dealerAccountList = dealerAccountOverview.result.map(dealerAccount => ({
    [COLUMNS_NAME.USER_ACCOUNT]: dealerAccount.name,
    [COLUMNS_NAME.BRAND]: dealerAccount.brand_ids,
    // [COLUMNS_NAME.SERVICE_CENTER]: dealerAccount.service_center_ids,
    [COLUMNS_NAME.ACTIVE_STATUS]: getActiveStatusText(dealerAccount.status),
    [COLUMNS_NAME.RESEND_EMAIL]:
      getActiveStatusText(dealerAccount.status) === ACTIVE_STATUS.unconfirmed
        ? dealerAccount.name
        : undefined,
  }))
  return {
    dealerAccountList,
    pagination: {
      total: dealerAccountOverview.total,
      total_pages: dealerAccountOverview.total_pages,
      page: dealerAccountOverview.page,
      page_size: dealerAccountOverview.page_size,
    },
  }
}

const getActiveStatusText = (value: Status) => {
  switch (value) {
    case Status.Enabled:
      return ACTIVE_STATUS.active
    case Status.Disabled:
      return ACTIVE_STATUS.Inactive
    case Status.Unconfirmed:
      return ACTIVE_STATUS.unconfirmed
  }
}

const getFilterList = (filterList: EmitFilterChanged["filterModel"]) => {
  let brandList: number[] = []
  // serviceCenterList: number[] = []
  let userName = "",
    status
  filterList.forEach(filter => {
    switch (filter.field) {
      case COLUMNS_NAME.BRAND:
        brandList = filter.filter.split(",").map(item => +item)
        break
      // case COLUMNS_NAME.SERVICE_CENTER:
      //   serviceCenterList = filter.filter.split(",").map(item => +item)
      // break
      case COLUMNS_NAME.USER_ACCOUNT:
        userName = filter.filter
        break
      case COLUMNS_NAME.ACTIVE_STATUS:
        status = filter.filter
        break
    }
  })
  return {
    brandList,
    // serviceCenterList,
    userName,
    status,
  }
}

export const resendTemporaryPassword = async (email: string) => {
  await teamMembersStore.resendTemporaryPassword(email)
}
