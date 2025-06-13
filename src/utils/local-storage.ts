import { Configuration } from "hylink-auth-user-api-client"

const STORAGE = {
  TOKEN: "token",
  FRAME_NUMBER: "frameNumber",
  IS_TEAMS: "isTeams",
}

export const storage = {
  removeToken: () => {
    localStorage.removeItem(STORAGE.TOKEN)
  },
  setToken: (token: Configuration["apiKey"]) => {
    localStorage.setItem(STORAGE.TOKEN, String(token))
  },
  getToken: (): Configuration["apiKey"] => {
    return localStorage.getItem(STORAGE.TOKEN) || undefined
  },
  removeFrameNumber: () => {
    localStorage.removeItem(STORAGE.FRAME_NUMBER)
  },
  setFrameNumber: (frameNumber: string) => {
    localStorage.setItem(STORAGE.FRAME_NUMBER, frameNumber)
  },
  getFrameNumber: () => {
    return localStorage.getItem(STORAGE.FRAME_NUMBER)
  },
  removeIsTeams: () => {
    localStorage.removeItem(STORAGE.IS_TEAMS)
  },
  setIsTeams: (isTeams: boolean) => {
    localStorage.setItem(STORAGE.IS_TEAMS, JSON.stringify(isTeams))
  },
  getIsTeams: () => {
    return JSON.parse(localStorage.getItem(STORAGE.IS_TEAMS) || "false")
  },
}
