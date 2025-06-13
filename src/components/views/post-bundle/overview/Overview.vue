<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import {
  type EmitFilterChanged,
  type EmitSortChanged,
  Table,
  Pagination,
  useLoading,
  Icons,
  ColumnPanel,
  Column,
} from "hyena-design-system"
import type { GridApi } from "ag-grid-community"
import useColumns from "@/components/views/post-bundle/overview/use-post-bundle-columns"
import {
  sortList,
  filterList,
  getPostBundleOverview,
} from "@/components/views/post-bundle/overview/post-bundle-overview"
import { getPagination, getPaginationData } from "@/utils/table"
import { useRouter } from "vue-router"
import { Routes } from "@/types/enums"
import { PostBundleOverviewList } from "@/types/post-bundle-type"
import { Pagination as PaginationType } from "@/types/table"

const { start } = useLoading()
const router = useRouter()
const sorters = reactive<EmitSortChanged["sortState"]>([])
const filters = reactive<EmitFilterChanged["filterModel"]>([])
const colDefs = useColumns()
const postBundleList = ref<PostBundleOverviewList[]>([])
const rowData = ref<PostBundleOverviewList[]>([])
const rowHeight = 45
const gridApi = ref<GridApi | null>(null)
const pagination = ref<PaginationType>({
  total: 0,
  total_pages: 1,
  page: 1,
  page_size: 10,
})

const onGridReady = (value: GridApi) => {
  gridApi.value = value
}

const setTableData = async () => {
  postBundleList.value = await getPostBundleOverview()
}

const getTableData = (page: number, tableData: PostBundleOverviewList[]) => {
  pagination.value = getPagination(page, tableData)
  rowData.value = getPaginationData(pagination.value, tableData)
}

const onFilter = (value: EmitFilterChanged) => {
  filters.splice(0, filters.length, ...value.filterModel)
  rowData.value = filterList(postBundleList.value, filters)
  getTableData(1, rowData.value)
}

const onSort = ({ sortState }: EmitSortChanged) => {
  sorters.splice(0, sorters.length, ...sortState)
  postBundleList.value = sortList(postBundleList.value, sorters)
  getTableData(1, postBundleList.value)
}

const onSelectColumnOption = async (newColumnDefs: Column<object>[]) => {
  if (gridApi.value) {
    gridApi.value.setColumnDefs(newColumnDefs)
  }
}

const onClick = (row: PostBundleOverviewList) => {
  const params = { dealerSupportHubId: row.id }
  router.push({
    name: Routes.VerifyBike,
    params,
  })
}

onMounted(async () => {
  const stop = start(true)
  try {
    await setTableData()
    getTableData(1, postBundleList.value)
  } finally {
    stop()
  }
})
</script>
<template>
  <div>
    <div class="table-outer-wrapper mx-5">
      <Table
        title="Overview"
        :row-data="rowData"
        :row-height="rowHeight"
        :column-defs="colDefs"
        :action="{ onClick, icon: Icons.NAVIGATE_NEXT }"
        @api-ready="onGridReady"
        @filter-changed="onFilter"
        @sort-changed="onSort" />
      <ColumnPanel
        v-if="gridApi && colDefs.length"
        :column-defs="colDefs"
        @select-option="onSelectColumnOption" />
    </div>
    <Pagination
      :total-items="pagination.total ?? 0"
      :end-page="pagination.total_pages ?? 1"
      :current-page="pagination.page"
      @pagination-changed="page => getTableData(page, postBundleList)" />
  </div>
</template>
<style scoped>
.table-outer-wrapper {
  position: relative;
}
:deep(.hy-column-panel) {
  position: absolute;
  top: 8px;
  right: 0;
}
</style>
