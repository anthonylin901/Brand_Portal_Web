import { computed, ComputedRef, reactive, ref, watch } from "vue"
import type { EmitFilterChanged, EmitSortChanged } from "hyena-design-system"
import { getLocalFormattedDatetime } from "@/utils/formatter"
import { COLUMNS_NAME, PostBundleCaseOverviewList } from "@/types/post-bundle-case-type"
import { storeToRefs } from "pinia"
import { getPagination, getPaginationData } from "@/utils/table"
import { useCaseStore } from "@/stores/use-case-store"
import { CaseManagementOverview } from "hyena-brand-portal-api-client"
import { NO_DATA } from "@/constants/common"

export const usePostBundleCaseOverview = () => {
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

  const { postBundleCaseList, getBrandListIdMap: brandIdMap } = storeToRefs(caseStore)

  const initData = async () => {
    await Promise.all([
      caseStore.getPostBundleCaseOverview(),
      caseStore.setBikeSpecList(),
      caseStore.setBrandList(),
    ])
    pagination.value = getPagination(pagination.value.page, tableData.value)
  }

  const pagedTableData = computed(() => {
    return getPaginationData(pagination.value, tableData.value)
  })

  const tableData: ComputedRef<PostBundleCaseOverviewList[]> = computed(() => {
    const dataRowList = postBundleCaseList.value.map((postBundleCase: CaseManagementOverview) => {
      return {
        [COLUMNS_NAME.ID]: postBundleCase.id,
        [COLUMNS_NAME.BIKE_SHOP]: postBundleCase.bike_shop.name ?? NO_DATA,
        [COLUMNS_NAME.HANDLER]: postBundleCase.handled_by ?? NO_DATA,
        [COLUMNS_NAME.BRAND]: postBundleCase.bike_spec.brand_id
          ? brandIdMap.value[postBundleCase.bike_spec.brand_id]?.name
          : NO_DATA,
        [COLUMNS_NAME.STAGE]: postBundleCase?.status,
        [COLUMNS_NAME.FRAME_NUMBER]: postBundleCase.vin,
        [COLUMNS_NAME.BIKE_MODEL]: postBundleCase.bike_spec.name,
        [COLUMNS_NAME.CREATED]: getLocalFormattedDatetime(new Date(postBundleCase.created_at)),
        [COLUMNS_NAME.UPDATED]: getLocalFormattedDatetime(new Date(postBundleCase.updated_at)),
      }
    })
    return sortList(filterList(dataRowList, filters.value), sorters.value)
  })

  const onFilterChange = (value: EmitFilterChanged) => {
    filters.value = [...value.filterModel]
  }

  const onSorterChange = ({ sortState }: EmitSortChanged) => {
    sorters.value = [...sortState]
  }

  const sortList = <T extends keyof PostBundleCaseOverviewList>(
    dataList: PostBundleCaseOverviewList[],
    sortList: EmitSortChanged["sortState"]
  ) => {
    if (sortList.length > 0) {
      sortList.forEach(sorter => {
        dataList.sort((firstValue, secondValue) => {
          if (sorter.field === COLUMNS_NAME.CREATED || sorter.field === COLUMNS_NAME.UPDATED) {
            const firstTime = new Date(firstValue[sorter.field])
            const secondTime = new Date(secondValue[sorter.field])
            const arrange = firstTime > secondTime ? 1 : -1
            return sorter.sort === "asc" ? arrange : -arrange
          } else {
            const field = sorter.field
            const firstFieldValue: string = firstValue[field as T]?.toString() ?? ""
            const secondFieldValue: string = secondValue[field as T]?.toString() ?? ""
            return sorter.sort === "asc"
              ? firstFieldValue.localeCompare(secondFieldValue)
              : secondFieldValue.localeCompare(firstFieldValue)
          }
        })
      })
    }
    return dataList
  }

  const filterList = <T extends keyof PostBundleCaseOverviewList>(
    dataList: PostBundleCaseOverviewList[],
    filterList: EmitFilterChanged["filterModel"]
  ) => {
    let filterDataList = [...dataList]
    filterList.forEach(filter => {
      filterDataList = filterDataList.filter(data => data[filter.field as T] === filter.filter)
    })
    return filterDataList
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
