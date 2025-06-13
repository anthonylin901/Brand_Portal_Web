<script setup lang="ts">
// TODO HDS (copy form BST)
import { onMounted, onUnmounted, ref, watch } from "vue"
import Anchor from "@/components/blocks/AnchorButton.vue"

export type ProgressSection = {
  label: string
  elementId: string
}

const props = defineProps<{
  sectionList: ProgressSection[]
  directSection?: ProgressSection
}>()

const currentSection = ref<ProgressSection>(props.sectionList[0])
const sectionElList = ref<(HTMLElement | null)[]>([])
const offsetYDiff = ref<number>(0)

watch(
  () => props.directSection,
  directSection => {
    if (directSection) {
      getIsActive(directSection)
      const index = props.sectionList.findIndex(
        section => section.elementId === directSection.elementId
      )
      onClick(index)
    }
  }
)

const setSectionRectList = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
  props.sectionList.forEach((section, id) => {
    const element = document.getElementById(section.elementId)
    sectionElList.value.push(element as HTMLElement)

    if (id === 0 && element instanceof HTMLElement) {
      const rect = element.getBoundingClientRect()
      offsetYDiff.value = rect.top + window.scrollY
    }
  })
}

const getIsActive = (section: ProgressSection) => {
  return section.elementId === currentSection.value.elementId
}

const getCurrentSection = () => {
  if (sectionElList.value.length) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    sectionElList.value.forEach((sectionEl, index) => {
      let rect = sectionEl?.getBoundingClientRect() as DOMRect

      if (window.scrollY === 0) {
        currentSection.value = props.sectionList[0]
      } else if (window.scrollY >= scrollableHeight) {
        currentSection.value = props.sectionList[sectionElList.value.length - 1]
      } else if (rect.top - offsetYDiff.value < 10 && rect.bottom - offsetYDiff.value > 0) {
        currentSection.value = props.sectionList[index]
      }
    })
  }
}

const onClick = (index: number) => {
  const windowScrollY = window.scrollY
  const element = sectionElList.value[index] as HTMLElement
  const rect = element.getBoundingClientRect()

  if (index === 0) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  } else {
    window.scrollTo({
      top: windowScrollY + rect.top - offsetYDiff.value,
      behavior: "smooth",
    })
  }
}

onMounted(() => {
  setSectionRectList()
  document.addEventListener("scroll", getCurrentSection)
})

onUnmounted(() => {
  document.removeEventListener("scroll", getCurrentSection)
})
</script>

<template>
  <div class="hy-progress-bar">
    <Anchor
      v-for="(section, id) in sectionList"
      :key="id"
      :active="getIsActive(section)"
      @click="onClick(id)">
      {{ section.label }}
    </Anchor>
  </div>
</template>

<style scoped>
.hy-progress-bar {
  position: sticky;
  left: 0;
}
</style>
