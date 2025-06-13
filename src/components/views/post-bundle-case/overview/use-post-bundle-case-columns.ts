import { FloatingFilter, TagCellRenderer, Variant } from "hyena-design-system"
import { computed } from "vue"
import { CaseManagementStatus } from "hyena-brand-portal-api-client"
import { underscoreToSpace, capitalize } from "@/utils/formatter"
import { caseStore } from "@/stores"
import { COLUMNS_NAME, TagCellRendererParams } from "@/types/post-bundle-case-type"

const useColumns = () => {
  const columns = computed(() => {
    const result = [
      {
        headerName: COLUMNS_NAME.BRAND,
        field: COLUMNS_NAME.BRAND,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: caseStore.getBrandNameFilterList,
          suppressFilterButton: true,
        },
      },
      {
        headerName: COLUMNS_NAME.BIKE_MODEL,
        field: COLUMNS_NAME.BIKE_MODEL,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: caseStore.getBikeSpecNameList,
          suppressFilterButton: true,
        },
      },
      {
        headerName: COLUMNS_NAME.FRAME_NUMBER,
        field: COLUMNS_NAME.FRAME_NUMBER,
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: caseStore.getPostBundleCaseFrameNumberFilterList,
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
        sortable: false,
        filter: true,
        cellRenderer: TagCellRenderer,
        cellRendererParams: (params: TagCellRendererParams) => {
          const status = params.value
          return {
            value: formatPostBundleCaseStatus(status),
            variant: getPostBundleCaseTagVariant(status),
          }
        },
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: caseStore.getStatusFilterListForPostBundleCase,
          suppressFilterButton: true,
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
        sortable: false,
      },
    ]
    return result
  })

  return columns
}

const getPostBundleCaseTagVariant = (status: CaseManagementStatus): string | null => {
  switch (status) {
    case CaseManagementStatus.Approved:
      return Variant.SUCCESS
    case CaseManagementStatus.Completed:
      return Variant.SECONDARY
    case CaseManagementStatus.Processing:
      return Variant.WARNING
    case CaseManagementStatus.ToDo:
      return Variant.ERROR
    default:
      return null
  }
}

export const formatPostBundleCaseStatus = (status: CaseManagementStatus) => {
  return capitalize(underscoreToSpace(status))
}

export default useColumns
