import { getTimeStampSecond } from "@/utils/formatter"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

export type ChangePasswordFormData = {
  newPassword: string
  confirmPassword: string
}

const useChangePassword = <T extends ChangePasswordFormData>(initialFormData: T) => {
  const formData = ref<T>(initialFormData)
  const route = useRoute()

  const isNewPasswordPass = computed(() => formData.value.newPassword.length >= 8)
  const isConfirmPasswordPass = computed(
    () => isNewPasswordPass.value && formData.value.newPassword === formData.value.confirmPassword
  )

  const checkIfExpired = () => {
    const query = route.query as Record<string, string>
    const isExpired = parseInt(query.expired_at) - getTimeStampSecond() < 0
    return isExpired
  }

  return {
    formData,
    isNewPasswordPass,
    isConfirmPasswordPass,
    checkIfExpired,
  }
}

export default useChangePassword
