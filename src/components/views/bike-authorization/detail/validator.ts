import { Ref } from "vue"
import { useVuelidate, Validation } from "@vuelidate/core"
import { required } from "@vuelidate/validators"

export const getRejectReasonValidator = (reason: Ref<string>): Ref<Validation> => {
  const rule = {
    reason: { required },
  }
  return useVuelidate(rule, { reason })
}
