import { computed } from "vue"
import { FloatingFilter, InputFilter, TagCellRenderer, Variant } from "hyena-design-system"
import DataListRender from "@/components/views/team-members/overview/DataList.vue"
import ResendButton from "@/components/views/team-members/overview/ResendButton.vue"
import {
  COLUMNS_NAME,
  BrandListRenderParams,
  ActiveStatusRenderParams,
  EmailParams,
  ACTIVE_STATUS,
  // ServiceCenterListRenderParams, 先註解, 目前後端架構先不需要 SERVICE_CENTER By Asa
} from "@/types/team-members"
import { teamMembersStore } from "@/stores"
import { Status } from "hyena-brand-portal-api-client"

const statusOptionList = [
  {
    label: ACTIVE_STATUS.active,
    value: Status.Enabled,
  },
  {
    label: ACTIVE_STATUS.Inactive,
    value: Status.Disabled,
  },
  {
    label: ACTIVE_STATUS.unconfirmed,
    value: Status.Unconfirmed,
  },
]

const useColumns = () => {
  const columns = computed(() => {
    const result = [
      {
        headerName: COLUMNS_NAME.USER_ACCOUNT,
        field: COLUMNS_NAME.USER_ACCOUNT,
        floatingFilterComponent: InputFilter,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        width: 300,
      },
      // 先註解, 目前後端架構先不需要 SERVICE_CENTER By Asa
      // {
      //   headerName: COLUMNS_NAME.SERVICE_CENTER,
      //   field: COLUMNS_NAME.SERVICE_CENTER,
      //   flex: 1,
      //   floatingFilterComponent: FloatingFilter,
      //   floatingFilterComponentParams: {
      //     options: teamMembersStore.getServiceCenterOptionList,
      //     suppressFilterButton: true,
      //     isMultiple: true,
      //   },
      //   cellRenderer: DataListRender,
      //   cellRendererParams: (params: ServiceCenterListRenderParams) => {
      //     return {
      //       dataList: mapServiceCenterId(params.value),
      //     }
      //   },
      //   minWidth: 250,
      // },
      {
        headerName: COLUMNS_NAME.BRAND,
        field: COLUMNS_NAME.BRAND,
        flex: 1,
        filter: false,
        cellRenderer: DataListRender,
        cellRendererParams: (params: BrandListRenderParams) => {
          return {
            dataList: mapBrandId(params.value),
          }
        },
      },
      {
        headerName: COLUMNS_NAME.ACTIVE_STATUS,
        field: COLUMNS_NAME.ACTIVE_STATUS,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: statusOptionList,
          suppressFilterButton: true,
        },
        cellRenderer: TagCellRenderer,
        cellRendererParams: (params: ActiveStatusRenderParams) => {
          const status = params.value
          return {
            variant: getActiveStatusTagVariant(status),
          }
        },
        cellClass: ["flex"],
        width: 200,
      },
      {
        headerName: COLUMNS_NAME.RESEND_EMAIL,
        field: COLUMNS_NAME.RESEND_EMAIL,
        filter: false,
        cellRenderer: ResendButton,
        cellRendererParams: (params: EmailParams) => {
          return {
            email: params.value,
          }
        },
      }
    ]
    return result
  })
  return columns
}

const mapBrandId = (idList: number[]) => {
  return idList.map(id => teamMembersStore.getBrandIdMapList.get(id))
}

// 先註解, 目前後端架構先不需要 SERVICE_CENTER By Asa
// const mapServiceCenterId = (idList: number[]) => {
//   return idList.map(id => teamMembersStore.getServiceCenterIdMapList.get(id))
// }

const getActiveStatusTagVariant = (status: ACTIVE_STATUS) => {
  switch (status) {
    case ACTIVE_STATUS.active:
      return Variant.SUCCESS
    case ACTIVE_STATUS.Inactive:
      return Variant.SECONDARY
    case ACTIVE_STATUS.unconfirmed:
      return Variant.WARNING
    default:
      return null
  }
}

export default useColumns
