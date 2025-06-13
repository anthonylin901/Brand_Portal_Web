import { useSnackbar, Variant } from "hyena-design-system"

const errorAlert = (message: string) => {
  useSnackbar(Variant.ERROR, message)
}

const successAlert = (message: string) => {
  useSnackbar(Variant.SUCCESS, message)
}

export { errorAlert, successAlert }
