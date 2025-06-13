import { Ref } from "vue"
import { useVuelidate, Validation } from "@vuelidate/core"
import { email, required, helpers } from "@vuelidate/validators"

const requiredFiled = {
  required: helpers.withMessage("Please fill in the required field.", required),
}

const emailFiled = {
  email: helpers.withMessage("Please fill in valid email format.", email),
}

export const getUsernameValidator = (username: Ref<string>): Ref<Validation> => {
  const rule = {
    username: { ...requiredFiled, ...emailFiled },
  }
  return useVuelidate(rule, { username })
}
