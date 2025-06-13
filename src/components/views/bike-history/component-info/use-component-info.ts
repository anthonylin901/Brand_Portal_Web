import { computed, Ref } from "vue"
import { ComponentCardData } from "@/types/common"
import { COMPONENT_CATEGORY } from "@/types/bike-history"
import { getPartList } from "@/components/views/bike-history/component-info/bike-component-info-bo"
import { ComponentInfo } from "@/types/bike-history"

const useComponentInfo = (partList: Ref<ComponentInfo[]>) => {

  const controlAndDisplayUnitList = computed<ComponentCardData[]>(() => {
    return getPartList(partList.value, COMPONENT_CATEGORY.ControlAndDisplayUnit)
  })

  const powerSupplyList = computed<ComponentCardData[]>(() => {
    return getPartList(partList.value, COMPONENT_CATEGORY.PowerSupply)
  })

  const driveUnitList = computed<ComponentCardData[]>(() => {
    return getPartList(partList.value, COMPONENT_CATEGORY.DriveUnit)
  })

  const accessoryList = computed<ComponentCardData[]>(() => {
    return getPartList(partList.value, COMPONENT_CATEGORY.Accessory)
  })

  return {
    controlAndDisplayUnitList,
    powerSupplyList,
    driveUnitList,
    accessoryList,
  }
}

export default useComponentInfo
