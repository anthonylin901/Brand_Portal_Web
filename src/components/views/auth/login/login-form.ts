import type { Configuration, LoginRequest } from "hylink-auth-user-api-client"
import { PostBundleApi } from "@/api/post-bundle"
import { TeamMembersApi } from "@/api/team-members"
import { storage } from "@/utils/local-storage"
import { userStore } from "@/stores"
import { CaseManagementApi } from "@/api/case"
import { EnumerationServiceApi } from "@/api/enumeration"
import { BikeServiceApi } from "@/api/bike"

export const getAccessToken = async (loginRequest: LoginRequest) => {
  const result = await userStore.userLogin(loginRequest)
  return result?.access_token
}

export const initialApi = async (token: Configuration["apiKey"]) => {
  await userStore.verifyToken(token)
  storage.setToken(token)
  PostBundleApi.setToken(token)
  TeamMembersApi.setToken(token)
  CaseManagementApi.setToken(token)
  EnumerationServiceApi.setToken(token)
  BikeServiceApi.setToken(token)
}

export const setIsTeams = (isTeams: boolean) => {
  userStore.setIsTeams(isTeams)
}
