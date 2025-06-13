import { Ref } from "vue"
import { useVuelidate, Validation } from "@vuelidate/core"
import { required, helpers } from "@vuelidate/validators"

const requiredFiled = {
  required: helpers.withMessage("Please fill in the required field.", required),
}

export const getInviteValidator = (
  brandID: Ref<number | null>,
  emailList: Ref<string[]>
): Ref<Validation> => {
  const rule = {
    brandID: { ...requiredFiled },
    emailList: { ...requiredFiled },
  }
  return useVuelidate(rule, { brandID, emailList })
}
