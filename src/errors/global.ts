import { errorAlert } from "@/utils/alert"
import { AxiosError } from "axios"

export const handleUncaughtError = (error: unknown) => {
  if (error instanceof AxiosError) {
    switch (error.code) {
      case "ECONNABORTED":
        errorAlert("Connection aborted.")
        break
      case "ETIMEDOUT":
        errorAlert("Responsed timeout.")
        break
      case "ERR_NETWORK":
        errorAlert("Network issue.")
        break
      default:
        errorAlert("This is an error from API.")
    }
  } else {
    errorAlert("Something went wrong.")
    console.error(error)
  }
}
