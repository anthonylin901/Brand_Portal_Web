import { Configuration, InstructionApiFactory } from "hyena-brand-portal-api-client"

export const InstructionApi = (token: Configuration["apiKey"]) => {
  const config = new Configuration({
    apiKey: token,
    basePath: import.meta.env.VITE_BP_API_URL,
  })

  const instructionApi = InstructionApiFactory(config)

  const getInstruction = async () => {
    const response = await instructionApi.getInstructionI18n("en-us")
    return response.data.result
  }

  return {
    getInstruction,
  }
}
