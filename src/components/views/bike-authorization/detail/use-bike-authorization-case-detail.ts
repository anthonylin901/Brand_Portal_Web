import { ref, watch } from "vue"
import { caseStore, userStore } from "@/stores"
import { CaseManagementStatus, VerifyWorkspaceCase } from "hyena-brand-portal-api-client"
import { Permissions } from "@/types/enums"

export const useBikeAuthorizationCaseDetail = (caseId: string) => {
  const caseDetail = ref<VerifyWorkspaceCase>()
  const reason = ref<string>("")
  const note = ref<string>("")

  const initData = async () => {
    caseDetail.value = await caseStore.getVerifyWorkspaceCase(caseId)
    note.value = caseDetail.value?.note || ""
  }

  const canHandleCase = ref<boolean>(userStore.canUserDo(Permissions.HANDLE_CASE_MANAGEMENT))
  watch(
    () => userStore.permission,
    () => {
      canHandleCase.value = userStore.canUserDo(Permissions.HANDLE_CASE_MANAGEMENT)
    }
  )

  const rejectCase = async (note: string, reason: string) => {
    await caseStore.handleVerifyWorkspaceCase(caseId, {
      status: CaseManagementStatus.Rejected,
      note,
      reason,
    })
  }

  const approveCase = async () => {
    await caseStore.handleVerifyWorkspaceCase(caseId, {
      status: CaseManagementStatus.Approved,
      note: note.value,
      reason: "",
    })
  }

  return {
    caseDetail,
    reason,
    note,
    canHandleCase,
    initData,
    rejectCase,
    approveCase,
  }
}
