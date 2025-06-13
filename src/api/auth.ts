import { Configuration, UserApiFactory, type LoginRequest } from "hylink-auth-user-api-client"
import { UserDetailType } from "@/types/auth"
import { getAuthConfig, throwIfNotExist } from "@/api/config"

type AuthApi = ReturnType<typeof UserApiFactory>
let _user: AuthApi | null = null

export const AuthApi = {
  setToken(token: Configuration["apiKey"]) {
    const _authConfig = getAuthConfig(token)
    _user = UserApiFactory(_authConfig)
  },

  async userLogin(request: LoginRequest) {
    const response = await throwIfNotExist(_user).login(request)
    return response.data.result
  },

  async verifyToken() {
    const response = await throwIfNotExist(_user).verifyToken()
    return response
  },

  async getUserDetail() {
    const response = await throwIfNotExist(_user).getUser()
    return response.data.result as UserDetailType
  },

  async getUserPermission() {
    const response = await throwIfNotExist(_user).getPermissions("bps")
    return response.data.result
  },

  async changePassword(...args: Parameters<AuthApi["changePassword"]>) {
    const response = await throwIfNotExist(_user).changePassword(...args)
    return response.data.result
  },

  async resetPassword(...args: Parameters<AuthApi["confirmForgotPassword"]>) {
    const response = await throwIfNotExist(_user).confirmForgotPassword(...args)
    return response.data.result
  },

  async forgetPassword(...args: Parameters<AuthApi["forgotPassword"]>) {
    const response = await throwIfNotExist(_user).forgotPassword(...args)
    return response?.data.result
  },
}
