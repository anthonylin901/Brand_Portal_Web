import type { EmitFilterChanged, EmitSortChanged } from "hyena-design-system"
import { getLocalFormattedDatetime } from "@/utils/formatter"
import { postBundleStore } from "@/stores"
import { getBikeSpec, getBrandList } from "@/components/views/post-bundle/post-bundle"
import {
  COLUMNS_NAME,
  PostBundleOverviewList,
  BikeSpecIdMap,
  BrandIdMap,
} from "@/types/post-bundle-type"
import { NO_DATA } from "@/constants/common"

// 合併相同 ID 的 post bundle、dealer support hub 資料
export const getPostBundleOverview = async (): Promise<PostBundleOverviewList[]> => {
  const [postBundleList, dealerSupportHubList, bikeSpecList, brandList] = await Promise.all([
    postBundleStore.getPostBundleOverview(),
    postBundleStore.getPostBundleDealerSupportHub(),
    getBikeSpecIdMap(),
    getBrandListIdMap(),
  ])
  const combineArray = postBundleList.map(postBundle => {
    const dealerSupportHub = dealerSupportHubList.find(dealerSupportHub => {
      return postBundle.dealer_support_hub_id === dealerSupportHub.id
    })
    return {
      id: dealerSupportHub?.id,
      [COLUMNS_NAME.VERIFY_CODE]: postBundle.verify_code,
      [COLUMNS_NAME.BIKE_SHOP]: dealerSupportHub?.bike_shop ?? NO_DATA,
      [COLUMNS_NAME.HANDLER]: dealerSupportHub?.handled_by ?? NO_DATA,
      [COLUMNS_NAME.BRAND]: dealerSupportHub?.brand_id
        ? brandList[dealerSupportHub?.brand_id]?.name
        : NO_DATA,
      [COLUMNS_NAME.STAGE]: dealerSupportHub?.status,
      [COLUMNS_NAME.FRAME_NUMBER]: postBundle.vin,
      [COLUMNS_NAME.BIKE_MODEL]: postBundle.bike_spec_id
        ? bikeSpecList[postBundle.bike_spec_id]?.name
        : NO_DATA,
      [COLUMNS_NAME.CREATED]: getLocalFormattedDatetime(new Date(postBundle.created_at)),
      [COLUMNS_NAME.UPDATED]: getLocalFormattedDatetime(new Date(postBundle.updated_at)),
    }
  })
  return combineArray
}

export const getBikeSpecIdMap = async () => {
  const bikeSpecList = await getBikeSpec()
  const result: BikeSpecIdMap = {}
  bikeSpecList.forEach(bikeSpec => {
    result[bikeSpec.id] = {
      ...bikeSpec,
    }
  })
  return result
}

export const getBrandListIdMap = async () => {
  const brandList = await getBrandList()
  const result: BrandIdMap = {}
  brandList.forEach(brand => {
    result[brand.id] = {
      ...brand,
    }
  })
  return result
}

export const sortList = <T extends keyof PostBundleOverviewList>(
  dataList: PostBundleOverviewList[],
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

export const filterList = <T extends keyof PostBundleOverviewList>(
  dataList: PostBundleOverviewList[],
  filterList: EmitFilterChanged["filterModel"]
) => {
  let filterDataList = [...dataList]
  filterList.forEach(filter => {
    filterDataList = filterDataList.filter(data => data[filter.field as T] === filter.filter)
  })
  return filterDataList
}
