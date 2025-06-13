import { Configuration as AuthConfig } from "hylink-auth-user-api-client"
import { Configuration as BrandPortalConfig } from "hyena-brand-portal-api-client"

let _authConfig: AuthConfig | null = null
let _brandPortalConfig: BrandPortalConfig | null = null
const basePath = import.meta.env.VITE_BP_API_URL
const authBasePath = import.meta.env.VITE_AUTH_API_URL

export const getAuthConfig = (token: AuthConfig["apiKey"]): AuthConfig => {
  if (!_authConfig || _authConfig.apiKey !== token) {
    _authConfig = new AuthConfig({
      apiKey: token,
      basePath: authBasePath,
    })
  }
  return _authConfig
}

export const getBrandPortalConfig = (token: BrandPortalConfig["apiKey"]): BrandPortalConfig => {
  if (!_brandPortalConfig || _brandPortalConfig.apiKey !== token) {
    _brandPortalConfig = new BrandPortalConfig({
      apiKey: token,
      basePath,
    })
  }
  return _brandPortalConfig
}

export const throwIfNotExist = <T>(factory: T | null): T => {
  if (!factory) {
    throw "Factory has not init"
  }
  return factory
}
