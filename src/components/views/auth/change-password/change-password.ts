import { userStore } from "@/stores"
import { ChangePasswordRequest } from "hylink-auth-user-api-client"

export const changePassword = async (
  username: string,
  tempPassword: string,
  newPassword: string
) => {
  const changePasswordRequestBody: ChangePasswordRequest = {
    username,
    previous_password: tempPassword,
    proposed_password: newPassword,
  }

  await userStore.changePassword(changePasswordRequestBody)
}
