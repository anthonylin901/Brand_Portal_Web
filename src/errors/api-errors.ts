import { AxiosError } from "axios"
import { ApiErrorCode } from "@/types/error"

export enum ApiFunctionName {
  Login = "login",
  GetVerifyCode = "getVerifyCode",
  GetBundleRule = "getBundleRule",
  SavePostBundle = "savePostBundle",
  ApprovePostBundle = "approvePostBundle",
  GetBundleInfo = "getBundleInfo",
  ConfirmBrandId = "confirmBrandId",
  ResetPassword = "ResetPassword",
}

const errorMessageMap: Record<string, Record<string, string>> = {
  [ApiErrorCode.ForeignKeyViolationException]: {},
  [ApiErrorCode.UniqueViolationException]: {},
  [ApiErrorCode.UnauthorizedException]: {},
  [ApiErrorCode.DisabledUserException]: {},
  [ApiErrorCode.InvalidUsernameOrPasswordException]: {},
  [ApiErrorCode.TokenExpiredException]: {},
  [ApiErrorCode.UserNotExistException]: {},
  [ApiErrorCode.ForbiddenException]: {},
  [ApiErrorCode.RestrictionException]: {},
  [ApiErrorCode.ParameterViolationException]: {},
  [ApiErrorCode.DuplicateEntityException]: {},
  [ApiErrorCode.UnhandledException]: {},
  [ApiErrorCode.UploadImageError]: {},
  [ApiErrorCode.NotFoundException]: {
    [ApiFunctionName.GetVerifyCode]: "Invalid code, please try again.",
    [ApiFunctionName.GetBundleRule]: "Can not get bundle rule",
    [ApiFunctionName.SavePostBundle]: "Save failed",
    [ApiFunctionName.ApprovePostBundle]: "Approve failed",
    [ApiFunctionName.GetBundleInfo]: "Get bundle info failed",
    [ApiFunctionName.ConfirmBrandId]: "Set brand failed",
    [ApiFunctionName.Login]: "Login Failed",
    [ApiFunctionName.ResetPassword]: "Reset password failed",
  },
  [ApiErrorCode.BadRequestException]: {
    [ApiFunctionName.GetVerifyCode]: "This code has already been taken by other brands.",
    [ApiFunctionName.GetBundleRule]: "Can not get bundle rule",
    [ApiFunctionName.SavePostBundle]: "Save failed",
    [ApiFunctionName.ApprovePostBundle]: "Approve failed",
    [ApiFunctionName.GetBundleInfo]: "Get bundle info failed",
    [ApiFunctionName.ConfirmBrandId]: "Set brand failed",
    [ApiFunctionName.Login]: "Login Failed",
    [ApiFunctionName.ResetPassword]: "Reset password failed",
  },
}

export const getApiErrorMessage = (error: unknown, event: ApiFunctionName): string => {
  try {
    if (error instanceof AxiosError) {
      return getApiEventMessage(error.response?.data.code, event, error.response?.data.message)
    }
    return ""
  } catch (error: unknown) {
    return `${error}`
  }
}

const getApiEventMessage = (
  errorCode: ApiErrorCode,
  event: ApiFunctionName,
  message?: string
): string => {
  const errorCodeEvent = errorMessageMap[errorCode]
  return errorCodeEvent[event] ?? message
}
