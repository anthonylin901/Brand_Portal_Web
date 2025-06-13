import { defineStore } from "pinia"
import { InstructionApi } from "@/api/instruction"
import { InstructionI18n } from "hyena-brand-portal-api-client"
import { storage } from "@/utils/local-storage"
interface State {
  instruction: InstructionI18n[]
}

export const useInstructionStore = defineStore("instruction", {
  state(): State {
    return {
      instruction: [],
    }
  },
  actions: {
    async getInstruction(): Promise<InstructionI18n[]> {
      const instruction = InstructionApi(storage.getToken())
      const result = await instruction.getInstruction()
      this.instruction = result
      return result
    },
  },
})
