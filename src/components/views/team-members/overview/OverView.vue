<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import {
  type EmitFilterChanged,
  Table,
  Pagination,
  useLoading,
  ColumnPanel,
  Column,
} from "hyena-design-system"
import type { GridApi } from "ag-grid-community"
import useColumns from "@/components/views/team-members/overview/use-team-members-columns"
import { Pagination as PaginationType } from "@/types/table"
import { getDealerAccountOverview } from "@/components/views/team-members/overview/team-members-overview"
import { DealerAccount } from "@/types/team-members"
import {
  setBrandOptionList,
  setServiceCenterList,
} from "@/components/views/team-members/team-members"

const { start } = useLoading()
const filters = reactive<EmitFilterChanged["filterModel"]>([])
const colDefs = useColumns()
const gridApi = ref<GridApi | null>(null)
const PAGE_SIZE = 10
const pagination = ref<PaginationType>({
  total: 0,
  total_pages: 1,
  page: 1,
  page_size: PAGE_SIZE,
})
const rowData = ref<DealerAccount[]>([])

const onGridReady = (value: GridApi) => {
  gridApi.value = value
}

const setTableData = async (page: number) => {
  const stop = start(true)
  try {
    const result = await getDealerAccountOverview(page, PAGE_SIZE, filters)
    pagination.value = result.pagination
    rowData.value = result.dealerAccountList
  } finally {
    stop()
  }
}

const onSelectColumnOption = async (newColumnDefs: Column<object>[]) => {
  if (gridApi.value) {
    gridApi.value.setColumnDefs(newColumnDefs)
  }
}

const onFilter = async (value: EmitFilterChanged) => {
  filters.splice(0, filters.length, ...value.filterModel)
  await setTableData(1)
}

onMounted(async () => {
  const stop = start(true)
  try {
    await Promise.all([setBrandOptionList(), setServiceCenterList()])
    await setTableData(1)
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
        :column-defs="colDefs"
        :rowHeight="60"
        @api-ready="onGridReady"
        @filter-changed="onFilter" />
      <ColumnPanel
        v-if="gridApi && colDefs.length"
        :column-defs="colDefs"
        @select-option="onSelectColumnOption" />
    </div>
    <Pagination
      :total-items="pagination.total ?? 0"
      :end-page="pagination.total_pages ?? 1"
      :current-page="pagination.page"
      @pagination-changed="page => setTableData(page)" />
  </div>
</template>
<style scoped>
:deep(.ag-floating-filter-full-body > .hy-select) {
  margin: 0 !important;
}
:deep(.el-select__tags) {
  max-width: 500px !important;
}

:deep(.ag-input-field-input) {
  border: 1px solid #000 !important;
  background-color: #fff !important;
  height: 35px;
}

:deep(.icon-cell) {
  text-align: center;
  font-size: 20px;
}

:deep(.ag-cell-wrapper) {
  width: -webkit-fill-available;
}

:deep(.data-list-box) {
  display: flex;
  flex-flow: nowrap;
  overflow: scroll;
}

:deep(.btn-filled) {
  font-size: 0.75rem;
  height: 40px;
}

:deep(.data-list-box::-webkit-scrollbar) {
  display: none;
}

:deep(.icon-cell .icon-check_circle_filled) {
  color: #006c4d;
}
.table-outer-wrapper {
  position: relative;
}
:deep(.hy-column-panel) {
  position: absolute;
  top: 8px;
  right: 0;
}
:deep(.ag-ltr .ag-cell) {
  display: flex;
}
</style>
