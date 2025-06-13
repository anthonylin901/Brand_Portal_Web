import { FloatingFilter, TagCellRenderer, Variant } from "hyena-design-system"
import { computed } from "vue"
import { CaseManagementStatus } from "hyena-brand-portal-api-client"
import { underscoreToSpace, capitalize } from "@/utils/formatter"
import { COLUMNS_NAME, TagCellRendererParams } from "@/types/bike-authorization"
import { caseStore } from "@/stores"

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
          options: caseStore.getVerifyWorkspaceCaseFrameNumberFilterList,
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
            value: formatCaseStatus(status),
            variant: getCaseStatusTagVariant(status),
          }
        },
        floatingFilterComponent: FloatingFilter,
        floatingFilterComponentParams: {
          options: caseStore.getStatusFilterListForBikeAuthorization,
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

const getCaseStatusTagVariant = (status: CaseManagementStatus): string | null => {
  switch (status) {
    case CaseManagementStatus.Approved:
      return Variant.SUCCESS
    case CaseManagementStatus.Completed:
      return Variant.SECONDARY
    case CaseManagementStatus.ToDo:
      return Variant.WARNING
    case CaseManagementStatus.Rejected:
      return Variant.ERROR
    default:
      return null
  }
}

export const formatCaseStatus = (status: CaseManagementStatus) => {
  return capitalize(underscoreToSpace(status))
}

export default useColumns
