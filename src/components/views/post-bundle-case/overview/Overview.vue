<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Routes } from "@/types/enums"
import { errorAlert } from "@/utils/alert"
import type { GridApi } from "ag-grid-community"
import { Table, Pagination, useLoading, Icons, ColumnPanel, Column } from "hyena-design-system"
import { PostBundleCaseOverviewList } from "@/types/post-bundle-case-type"
import useColumns from "@/components/views/post-bundle-case/overview/use-post-bundle-case-columns"
import { usePostBundleCaseOverview } from "@/components/views/post-bundle-case/overview/overview"

const { start } = useLoading()
const router = useRouter()
const colDefs = useColumns()
const rowHeight = 45
const gridApi = ref<GridApi | null>(null)

const { initData, onSorterChange, onFilterChange, pagedTableData, pagination } =
  usePostBundleCaseOverview()

const onGridReady = (value: GridApi) => {
  gridApi.value = value
}

const onSelectColumnOption = async (newColumnDefs: Column<object>[]) => {
  if (gridApi.value) {
    gridApi.value.setColumnDefs(newColumnDefs)
  }
}

const onClick = (row: PostBundleCaseOverviewList) => {
  const params = { caseId: row.id }
  router.push({
    name: Routes.PostBundleCaseVerify,
    params,
  })
}

onMounted(async () => {
  const stop = start(true)
  try {
    await initData()
  } catch (error) {
    errorAlert("Fail to get bike authorization data")
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
        :row-data="pagedTableData"
        :row-height="rowHeight"
        :column-defs="colDefs"
        :action="{ onClick, icon: Icons.NAVIGATE_NEXT }"
        @api-ready="onGridReady"
        @filter-changed="onFilterChange"
        @sort-changed="onSorterChange" />
      <ColumnPanel
        v-if="gridApi && colDefs.length"
        :column-defs="colDefs"
        @select-option="onSelectColumnOption" />
    </div>
    <Pagination
      :total-items="pagination.total ?? 0"
      :end-page="pagination.total_pages ?? 1"
      :current-page="pagination.page"
      @pagination-changed="page => (pagination.page = page)" />
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
