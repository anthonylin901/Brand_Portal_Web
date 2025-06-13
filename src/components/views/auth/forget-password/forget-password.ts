import { userStore } from "@/stores"

export const sendForgetPasswordEmail = async (email: string) => {
  return await userStore.sendForgetPasswordEmail(email)
}
