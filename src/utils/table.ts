import { Pagination } from "@/types/table"

export const getPagination = (page: number, dataList: unknown[]): Pagination => {
  const pageSize = 10
  const pagination = {
    page: page,
    page_size: pageSize,
    total_pages: Math.ceil(dataList.length / pageSize) || 1,
    total: dataList.length,
  }
  return pagination
}

export const getPaginationData = <T>(pagination: Pagination, dataList: T[]): T[] => {
  const result = dataList.slice(
    (pagination.page - 1) * pagination.page_size,
    pagination.page_size * pagination.page
  )
  return result
}
