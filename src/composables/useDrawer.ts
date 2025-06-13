import { ref } from "vue"

interface DrawerData {
  title: string | null
  type: string | null
}
const drawerData = ref<DrawerData>({
  title: null,
  type: null,
})

const isShow = ref(false)
const timeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const useDrawer = () => {
  const active = async () => {
    if (isShow.value) {
      close()
      await timeout(500)
    }
    isShow.value = true
  }
  const close = () => {
    isShow.value = false
  }
  return { isShow, drawerData, active, close }
}

export default useDrawer
