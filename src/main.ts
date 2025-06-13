import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "@/App.vue"
import router from "@/router"
import { throttleButton } from "@/utils/directive"
import { handleUncaughtError } from "@/errors/global"
import "hyena-design-system/style.css"

const pinia = createPinia()
const app = createApp(App)
app.config.errorHandler = (error: unknown) => {
  handleUncaughtError(error)
}
app.use(router).use(pinia).directive("throttle", throttleButton).mount("#app")
