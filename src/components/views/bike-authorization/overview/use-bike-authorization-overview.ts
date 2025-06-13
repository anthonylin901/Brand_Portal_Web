import { ref, computed, ComputedRef, watch } from "vue"
import { storeToRefs } from "pinia"
import type { EmitFilterChanged, EmitSortChanged } from "hyena-design-system"
import { useCaseStore } from "@/stores/use-case-store"
import { getPagination, getPaginationData } from "@/utils/table"
import { CaseManagementOverview } from "hyena-brand-portal-api-client"
import { BikeAuthorizationCaseOverviewList, COLUMNS_NAME } from "@/types/bike-authorization"
import { NO_DATA } from "@/constants/common"
import { getLocalFormattedDatetime } from "@/utils/formatter"

export const useBikeAuthorizationOverview = () => {
  const caseStore = useCaseStore()
  const sorters = ref<EmitSortChanged["sortState"]>([
    {
      field: COLUMNS_NAME.UPDATED,
      sort: "desc",
      sortOrder: 0,
    },
  ])
  const filters = ref<EmitFilterChanged["filterModel"]>([])
  const pagination = ref({
    total: 0,
    total_pages: 1,
    page: 1,
    page_size: 10,
  })

  const { verifyWorkspaceCaseList, getBrandListIdMap: brandIdMap } = storeToRefs(caseStore)

  const initData = async () => {
    await Promise.all([
      caseStore.getVerifyWorkspaceCaseOverview(),
      caseStore.setBikeSpecList(),
      caseStore.setBrandList(),
    ])
    pagination.value = getPagination(pagination.value.page, tableData.value)
  }

  const tableData: ComputedRef<BikeAuthorizationCaseOverviewList[]> = computed(() => {
    const dataRowList = verifyWorkspaceCaseList.value.map((caseItem: CaseManagementOverview) => ({
      [COLUMNS_NAME.ID]: caseItem.id,
      [COLUMNS_NAME.BIKE_SHOP]: caseItem.bike_shop.name ?? NO_DATA,
      [COLUMNS_NAME.HANDLER]: caseItem.handled_by ?? NO_DATA,
      [COLUMNS_NAME.BRAND]: caseItem.bike_spec.brand_id
        ? brandIdMap.value[caseItem.bike_spec.brand_id]?.name
        : NO_DATA,
      [COLUMNS_NAME.STAGE]: caseItem?.status,
      [COLUMNS_NAME.FRAME_NUMBER]: caseItem.vin,
      [COLUMNS_NAME.BIKE_MODEL]: caseItem.bike_spec.name,
      [COLUMNS_NAME.CREATED]: getLocalFormattedDatetime(new Date(caseItem.created_at)),
      [COLUMNS_NAME.UPDATED]: getLocalFormattedDatetime(new Date(caseItem.updated_at)),
    }))
    return sortList(filterList(dataRowList, filters.value), sorters.value)
  })

  const pagedTableData = computed(() => {
    return getPaginationData(pagination.value, tableData.value)
  })

  const sortList = <T extends keyof BikeAuthorizationCaseOverviewList>(
    dataList: BikeAuthorizationCaseOverviewList[],
    sortList: EmitSortChanged["sortState"]
  ) => {
    if (sortList.length > 0) {
      sortList.forEach(sorter => {
        dataList.sort((a, b) => {
          if (sorter.field === COLUMNS_NAME.CREATED || sorter.field === COLUMNS_NAME.UPDATED) {
            const aTime = new Date(a[sorter.field])
            const bTime = new Date(b[sorter.field])
            return sorter.sort === "asc"
              ? aTime.getTime() - bTime.getTime()
              : bTime.getTime() - aTime.getTime()
          } else {
            const aValue = a[sorter.field as T]?.toString() ?? ""
            const bValue = b[sorter.field as T]?.toString() ?? ""
            return sorter.sort === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
        })
      })
    }
    return dataList
  }

  const filterList = <T extends keyof BikeAuthorizationCaseOverviewList>(
    dataList: BikeAuthorizationCaseOverviewList[],
    filterList: EmitFilterChanged["filterModel"]
  ) => {
    return filterList.reduce(
      (filteredData, filter) =>
        filteredData.filter(data => data[filter.field as T] === filter.filter),
      [...dataList]
    )
  }

  const onFilterChange = (value: EmitFilterChanged) => {
    filters.value = [...value.filterModel]
  }

  const onSorterChange = ({ sortState }: EmitSortChanged) => {
    sorters.value = [...sortState]
  }

  watch(tableData, () => {
    pagination.value = getPagination(pagination.value.page, tableData.value)
  })

  return {
    pagedTableData,
    pagination,
    initData,
    onFilterChange,
    onSorterChange,
  }
}
