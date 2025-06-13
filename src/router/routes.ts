import { RouteRecordRaw } from "vue-router"
import { Icons } from "hyena-design-system"
import { Routes } from "@/types/enums"
import { PATH } from "@/constants/router"
import PageNotFound from "@/components/views/PageNotFound.vue"

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: Routes.DefaultLayout,
    component: () => import("@/components/views/DefaultLayout.vue"),
    meta: {
      requiresToken: true,
    },
    redirect: () => {
      return { name: Routes.BikeHistory }
    },
    children: [
      {
        path: PATH.BIKE_HISTORY,
        name: Routes.BikeHistory,
        component: () => import("@/components/views/BikeHistoryView.vue"),
        meta: {
          icon: Icons.TRIP_TIME,
          requiresToken: true,
        },
        children: [
          {
            path: PATH.BIKE_HISTORY_SEARCH,
            name: Routes.BikeHistorySearch,
            component: () => import("@/components/views/bike-history/search/BikeSearch.vue"),
          },
          {
            path: PATH.BIKE_HISTORY_DETAIL,
            name: Routes.BikeHistoryDetail,
            component: () => import("@/components/views/bike-history/detail/BikeDetail.vue"),
          },
          {
            path: PATH.BIKE_HISTORY_COMPONENT_INFO,
            name: Routes.BikeHistoryComponentInfo,
            component: () =>
              import("@/components/views/bike-history/component-info/BikeComponentInfo.vue"),
            meta: {
              requiresToken: true,
            },
          },
        ],
      },
      {
        path: PATH.POST_BUNDLE,
        name: Routes.PostBundle,
        component: () => import("@/components/views/PostBundleView.vue"),
        meta: {
          icon: Icons.FACTORY,
          requiresToken: true,
        },
        children: [
          {
            path: PATH.OVERVIEW,
            name: Routes.PostBundleOverview,
            component: () => import("@/components/views/post-bundle/overview/Overview.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: PATH.VERIFY_CODE,
            name: Routes.VerifyCode,
            component: () => import("@/components/views/post-bundle/verify/VerifyCode.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: `${PATH.BRAND_CHECK}/:verifyCode`,
            name: Routes.BrandCheck,
            component: () => import("@/components/views/post-bundle/brand-check/BrandCheck.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: `${PATH.VERIFY_BIKE}/:dealerSupportHubId`,
            name: Routes.VerifyBike,
            component: () => import("@/components/views/post-bundle/verify/VerifyBike.vue"),
            meta: {
              requiresToken: true,
            },
          },
        ],
      },
      {
        path: PATH.BIKE_AUTHORIZATION,
        name: Routes.BikeAuthorization,
        component: () => import("@/components/views/BikeAuthorizationView.vue"),
        meta: {
          icon: Icons.PRE_BUNDLE,
          requiresToken: true,
        },
        children: [
          {
            path: PATH.OVERVIEW,
            name: Routes.BikeAuthorizationOverview,
            component: () => import("@/components/views/bike-authorization/overview/Overview.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: `${PATH.BIKE_AUTHORIZATION_DETAIL}/:caseId`,
            name: Routes.BikeAuthorizationDetail,
            component: () => import("@/components/views/bike-authorization/detail/Detail.vue"),
            meta: {
              requiresToken: true,
            },
          },
        ],
      },
      {
        path: PATH.POST_BUNDLE_CASE,
        name: Routes.PostBundleCase,
        component: () => import("@/components/views/PostBundleCaseView.vue"),
        meta: {
          icon: Icons.FACTORY,
          requiresToken: true,
        },
        children: [
          {
            path: PATH.OVERVIEW,
            name: Routes.PostBundleCaseOverview,
            component: () => import("@/components/views/post-bundle-case/overview/Overview.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: `${PATH.POST_BUNDLE_CASE}/:caseId`,
            name: Routes.PostBundleCaseVerify,
            component: () =>
              import("@/components/views/post-bundle-case/verify/PostBundleCaseVerify.vue"),
            meta: {
              requiresToken: true,
            },
          },
        ],
      },
      {
        path: PATH.TEAM_MEMBERS,
        name: Routes.TeamMembers,
        component: () => import("@/components/views/TeamMembers.vue"),
        meta: {
          icon: Icons.TEAM,
          requiresToken: true,
        },
        children: [
          {
            path: PATH.OVERVIEW,
            name: Routes.TeamMembersOverview,
            component: () => import("@/components/views/team-members/overview/OverView.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: PATH.INVITE_DEALER,
            name: Routes.InviteDealerAccount,
            component: () =>
              import("@/components/views/team-members/invite-dealer/InviteDealerAccount.vue"),
            meta: {
              requiresToken: true,
            },
          },
          {
            path: PATH.SEND_EMAIL_SUCCESS,
            name: Routes.SendEmailSuccess,
            component: () =>
              import("@/components/views/team-members/invite-dealer/SendEmailSuccess.vue"),
            meta: {
              requiresToken: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: PATH.LOGIN,
    name: Routes.Login,
    component: () => import("@/components/views/LoginView.vue"),
  },
  {
    path: PATH.FORGET_PASSWORD,
    name: Routes.ForgetPassword,
    component: () => import("@/components/views/auth/forget-password/ForgetPasswordView.vue"),
  },
  {
    path: PATH.RESET_PASSWORD,
    name: Routes.ResetPassword,
    component: () => import("@/components/views/auth/reset-password/ResetPasswordView.vue"),
  },
  {
    path: PATH.CHANGE_PASSWORD,
    name: Routes.ChangePassword,
    component: () => import("@/components/views/auth/change-password/ChangePasswordView.vue"),
  },
  {
    path: PATH.CHANGE_TEMP_PASSWORD,
    name: Routes.ChangeTempPassword,
    component: () => import("@/components/views/auth/change-password/ChangeTempPasswordView.vue"),
  },
  {
    path: PATH.NO_PERMISSION,
    name: Routes.NoPermission,
    component: () => import("@/components/views/NoPermission.vue"),
  },
  {
    path: PATH.ERROR_PAGE,
    name: Routes.PageNotFound,
    component: PageNotFound,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
]
