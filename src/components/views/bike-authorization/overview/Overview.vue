<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Table, Pagination, Icons, ColumnPanel, Column, useLoading } from "hyena-design-system"
import { useBikeAuthorizationOverview } from "@/components/views/bike-authorization/overview/use-bike-authorization-overview"
import { useRouter } from "vue-router"
import useColumns from "@/components/views/bike-authorization/overview/use-bike-authorization-columns"
import { GridApi } from "ag-grid-community"
import { Routes } from "@/types/enums"
import { BikeAuthorizationCaseOverviewList } from "@/types/bike-authorization"
import { errorAlert } from "@/utils/alert"

const colDefs = useColumns()
const rowHeight = 45
const gridApi = ref<GridApi | null>(null)
const { start } = useLoading()

const { pagedTableData, pagination, initData, onSorterChange, onFilterChange } =
  useBikeAuthorizationOverview()

onMounted(async () => {
  const stop = start("Getting bike authorization data")
  try {
    await initData()
  } catch (error) {
    errorAlert("Fail to get bike authorization data")
  } finally {
    stop()
  }
})

const onGridReady = (value: GridApi) => {
  gridApi.value = value
}

const onSelectColumnOption = async (newColumnDefs: Column<object>[]) => {
  if (gridApi.value) {
    gridApi.value.setColumnDefs(newColumnDefs)
  }
}

const router = useRouter()
const onRowClick = (row: BikeAuthorizationCaseOverviewList) => {
  router.push({
    name: Routes.BikeAuthorizationDetail,
    params: {
      caseId: row.id,
    },
  })
}
</script>

<template>
  <div>
    <div class="table-outer-wrapper mx-5">
      <Table
        title="Overview"
        :row-data="pagedTableData"
        :row-height="rowHeight"
        :column-defs="colDefs"
        :action="{ onClick: onRowClick, icon: Icons.NAVIGATE_NEXT }"
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
