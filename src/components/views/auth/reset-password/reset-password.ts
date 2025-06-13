import { userStore } from "@/stores"

export const resetPassword = async (
  username: string,
  password: string,
  confirmationCode: string
) => {
  return await userStore.resetPassword({ username, password, confirmation_code: confirmationCode })
}
