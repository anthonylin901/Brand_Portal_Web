import { FloatingFilter, TagCellRenderer, Variant } from "hyena-design-system"
import { computed } from "vue"
import { DealerSupportHubStatus } from "hyena-brand-portal-api-client"
import { underscoreToSpace, capitalize } from "@/utils/formatter"
import { Permissions } from "@/types/enums"
import { postBundleStore, userStore } from "@/stores"
import { COLUMNS_NAME, TagCellRendererParams } from "@/types/post-bundle-type"

const useColumns = () => {
  const columns = computed(() => {
    const result = [
      {
        headerName: COLUMNS_NAME.VERIFY_CODE,
        field: COLUMNS_NAME.VERIFY_CODE,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: postBundleStore.getVerifyCodeFilterList,
          suppressFilterButton: true,
        },
      },
      {
        headerName: COLUMNS_NAME.BIKE_MODEL,
        field: COLUMNS_NAME.BIKE_MODEL,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: postBundleStore.getBikeSpecNameList,
          suppressFilterButton: true,
        },
      },
      {
        headerName: COLUMNS_NAME.FRAME_NUMBER,
        field: COLUMNS_NAME.FRAME_NUMBER,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: postBundleStore.getFrameNumberFilterList,
          suppressFilterButton: true,
        },
      },
      {
        headerName: COLUMNS_NAME.BIKE_SHOP,
        field: COLUMNS_NAME.BIKE_SHOP,
        filter: false,
      },
      {
        headerName: COLUMNS_NAME.STAGE,
        field: COLUMNS_NAME.STAGE,
        filter: false,
        sortable: true,
        cellRenderer: TagCellRenderer,
        cellRendererParams: (params: TagCellRendererParams) => {
          const status = params.value
          return {
            value: formatDealerSupportHubStatus(status),
            variant: getPostBundleTagVariant(status),
          }
        },
        cellClass: ["flex"],
      },
      {
        headerName: COLUMNS_NAME.CREATED,
        field: COLUMNS_NAME.CREATED,
        filter: false,
        sortable: true,
      },
      {
        headerName: COLUMNS_NAME.UPDATED,
        field: COLUMNS_NAME.UPDATED,
        filter: false,
        sortable: true,
      },
      {
        headerName: COLUMNS_NAME.HANDLER,
        field: COLUMNS_NAME.HANDLER,
        filter: false,
        sortable: true,
        flex: 1,
      },
    ]
    if (userStore.limitUserDo(Permissions.GET_DEALER_SUPPORT_HUB)) {
      result.unshift({
        headerName: COLUMNS_NAME.BRAND,
        field: COLUMNS_NAME.BRAND,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: postBundleStore.getBrandNameFilterList,
          suppressFilterButton: true,
        },
      })
    }
    return result
  })

  return columns
}

const getPostBundleTagVariant = (status: DealerSupportHubStatus): string | null => {
  switch (status) {
    case DealerSupportHubStatus.Approved:
      return Variant.SUCCESS
    case DealerSupportHubStatus.Completed:
      return Variant.SECONDARY
    case DealerSupportHubStatus.Processing:
      return Variant.WARNING
    case DealerSupportHubStatus.ToDo:
      return Variant.ERROR
    default:
      return null
  }
}

export const formatDealerSupportHubStatus = (status: DealerSupportHubStatus) => {
  return capitalize(underscoreToSpace(status))
}

export default useColumns
