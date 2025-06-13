<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import InputCube from "@/components/blocks/InputCube.vue"
import { Button, useLoading } from "hyena-design-system"
import { DealerSupportHub } from "hyena-brand-portal-api-client"
import {
  getDealerSupportHub,
  getPostBundleByVerifyCode,
  getCurrentBrandIdList,
  HYENA_BRAND,
  Message,
} from "@/components/views/post-bundle/post-bundle"
import { getApiErrorMessage, ApiFunctionName } from "@/errors/api-errors"
import { getFormatVerifyCode } from "@/utils/formatter"
import { Routes } from "@/types/enums"

const router = useRouter()
const { start } = useLoading()
const INPUT_AMOUNT = 8
const DASH_POSITION = 2
const verifyCode = ref<string>("")
const errorMessage = ref<string>("")

watch(verifyCode, async newValue => {
  errorMessage.value = ""
  if (newValue.length === INPUT_AMOUNT) {
    const verifyCode = getFormatVerifyCode(newValue, DASH_POSITION)
    await checkClientInteraction(verifyCode)
  }
})

const checkClientInteraction = async (verifyCode: string) => {
  const stop = start(true)
  try {
    const postBundle = await getPostBundleByVerifyCode(verifyCode)
    if (!postBundle) {
      errorMessage.value = Message.INVALID_VERIFY_CODE
      return
    }
    const dealerSupport = await getDealerSupportHub(postBundle.dealer_support_hub_id)
    directVerifyCodeNextPage(dealerSupport, verifyCode)
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, ApiFunctionName.GetVerifyCode)
  } finally {
    stop()
  }
}

const directVerifyCodeNextPage = (dealerSupport: DealerSupportHub, verifyCode: string) => {
  const currentBrandIdList = getCurrentBrandIdList()
  // 若登入 BrandID 與使用者相同或為 Hyena 則直接進入 verify bike
  if (
    dealerSupport.brand_id &&
    (currentBrandIdList.includes(dealerSupport.brand_id) ||
      currentBrandIdList.includes(HYENA_BRAND))
  ) {
    router.push({
      name: Routes.VerifyBike,
      params: { dealerSupportHubId: dealerSupport.id },
    })
    return
  }
  if (dealerSupport.brand_id) {
    // 若該車已有 brand
    errorMessage.value = Message.VERIFY_CODE_TAKEN
    return
  }
  router.push({ name: Routes.BrandCheck, params: { verifyCode: verifyCode } })
}
</script>
<template>
  <div class="verify-code-box text-center">
    <h3 class="fs-headline text-on-background">Enter Post-bundle Verification Code</h3>
    <div class="fw-normal fs-title-lg mb-4 text-on-surface-variant">
      Enter the verification code that the bike shop provided to you
    </div>
    <div>
      <InputCube
        v-model="verifyCode"
        :box-amount="INPUT_AMOUNT"
        :dash-position="DASH_POSITION"
        :is-invalid="errorMessage !== ''"
        :auto-focus="true" />
      <div v-if="errorMessage" class="error-message text-error">{{ errorMessage }}</div>
      <div>
        <Button
          :type="'text'"
          class="mt-5"
          @click="router.push({ name: Routes.PostBundleOverview })">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.verify-code-box {
  margin-top: 6rem;
}

.error-message {
  margin-top: -2rem;
  margin-bottom: 1rem;
}
</style>
