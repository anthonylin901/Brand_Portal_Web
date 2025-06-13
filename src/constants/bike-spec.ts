import { SpeedLimitOption } from "hyena-brand-portal-api-client"

export const BikeSpecSpeedLimit = {
  [SpeedLimitOption._24]: "24 km/h (JP)",
  [SpeedLimitOption._25]: "25 km/h (KR)",
  [SpeedLimitOption._245Full]: "25 km/h (EU、AU)",
  [SpeedLimitOption._32]: "32 km/h (US、NZ)",
  [SpeedLimitOption._45]: "45 km/h (US)",
  [SpeedLimitOption._29Full]: "29 km/h (Special)",
  [SpeedLimitOption._25Full]: "25 km/h (EU)", // 這個已經沒有用到了，但是 TS 檢查的時候會報錯，所以先保留
}
