export enum Routes {
  Login = "Login",
  NoPermission = "NoPermission",
  DefaultLayout = "DefaultLayout",
  BikeHistory = "BikeHistory",
  BikeHistorySearch = "BikeHistorySearch",
  BikeHistoryDetail = "BikeHistoryDetail",
  BikeHistoryComponentInfo = "BikeHistoryComponentInfo",
  PostBundle = "PostBundle",
  PostBundleOverview = "PostBundleOverview",
  VerifyCode = "VerifyCode",
  BrandCheck = "BrandCheck",
  VerifyBike = "VerifyBike",
  PostBundleCase = "PostBundleCase",
  PostBundleCaseVerify = "PostBundleCaseVerify",
  PostBundleCaseOverview = "PostBundleCaseOverview",
  TeamMembers = "TeamMembers",
  TeamMembersOverview = "TeamMembersOverview",
  InviteDealerAccount = "InviteDealerAccount",
  SendEmailSuccess = "SendEmailSuccess",
  PageNotFound = "PageNotFound",
  ForgetPassword = "ForgetPassword",
  ResetPassword = "ResetPassword",
  ChangePassword = "ChangePassword",
  ChangeTempPassword = "ChangeTempPassword",
  BikeAuthorization = "BikeAuthorization",
  BikeAuthorizationOverview = "BikeAuthorizationOverview",
  BikeAuthorizationDetail = "BikeAuthorizationDetail",
}

export enum PageTitle {
  BikeHistory = "Bike History",
  ComponentInfo = "Component Information",
  HyenaBrandPortal = "Hyena Brand Portal",
  PostBundle = "Post-bundle (HST)",
  PostBundleCase = "Post-bundle (DP)",
  TeamMembers = "Team Members",
  BikeAuthorization = "Bike Authorization",
  PostBundleCaseVerify = "Post-bundle (DP) Verify",
}

export enum ImageUrl {
  HeaderLogo = "/images/hy_logo.svg",
  HyIcon = "/images/hyena_logo_icon.svg",
  HyCatGif = "/images/door-hide.gif",
}

export enum BikeHistoryType {
  Production = "production",
  Activation = "activation",
  FirmWareUpdate = "firmWareUpdate",
  ReplacementPart = "replacementPart",
  ErrorCode = "errorCode",
  NoError = "noError",
}

export enum Permissions {
  VIEW_ADD_POST_BUNDLE = "view_add_post_bundle", // 可以 + post bundle
  MANAGE_DEALER_SUPPORT_HUB = "manage_bike",
  HANDLE_DEALER_SUPPORT_HUB = "handle_dealer_support_hub",
  GET_CASE_MANAGEMENT = "get_case_management",
  HANDLE_CASE_MANAGEMENT = "handle_case_management",
  UPDATE_CASE_MANAGEMENT = "update_case_management",
  GET_DEALER_SUPPORT_HUB = "get_dealer_support_hub", // 可以看到 brand
  GET_DEALER_ACCOUNT = "get_dealer_account",
  CREATE_DEALER_ACCOUNT = "create_dealer_account",
}

export enum IncompatiblePartNumberKey {
  IS_INCORRECT_BIKE_MODEL = "IS_INCORRECT_BIKE_MODEL",
  ASK_BIKE_SHOP_FOR_PARTS_REPLACEMENT = "ASK_BIKE_SHOP_FOR_PARTS_REPLACEMENT",
  ASK_BIKE_SHOP_TO_CONNECT_BIKE_AND_SUBMIT_FORM_AGAIN = "ASK_BIKE_SHOP_TO_CONNECT_BIKE_AND_SUBMIT_FORM_AGAIN",
  VERIFY_THE_INFORMATION_AND_TRY_APPROVE_AGAIN = "VERIFY_THE_INFORMATION_AND_TRY_APPROVE_AGAIN",
}
