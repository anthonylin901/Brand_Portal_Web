import dayjs from "dayjs"
import { PartType } from "hyena-brand-portal-api-client"
import { SENSOR_DIAGNOSIS_PART } from "@/types/bike-history"

export const getLocalFormattedDatetime = (date: Date) => {
  return date.toLocaleString("sv-SE")
}

export const underscoreToSpace = (str: string) => {
  return str.includes("_") ? str.split("_").join(" ") : str
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 轉換字串成 verify code 格式字串
 */
export const getFormatVerifyCode = (value: string, dashPosition: number): string => {
  return `${value.slice(0, dashPosition)}-${value.slice(dashPosition)}`
}

export const getTimeStampSecond = () => {
  return new Date().getTime() / 1000
}

export const getUTCTimeZone = () => {
  const dateStringList = new Date().toString().split(" ")
  const UTCtimeZone =
    dateStringList.find(string => string.indexOf("GMT") !== -1)?.replace("GTM", "UTC") || ""
  return UTCtimeZone
}

export const getUserNameByEmail = (email: string) => {
  const splitEmailByAt: string[] = email.split("@")
  const fullUserName: string = splitEmailByAt[0]
  const lowerCaseFullUserName = fullUserName.toLowerCase()
  const isHasTeams: boolean = lowerCaseFullUserName.indexOf("teams_") > -1
  return isHasTeams
    ? fullUserName.split("Teams_")[1] || fullUserName.split("teams_")[1]
    : fullUserName
}

export const dashToSpace = (str: string) => {
  return str.includes("-") ? str.split("-").join(" ") : str
}

export const capitalizeWords = (str: string) => {
  const strList = str.split(" ")
  return strList.map(word => capitalize(word)).join(" ")
}

export const formatDate = (date: Date | string, rule: string): string => {
  return dayjs(date).format(rule)
}

export const capitalizeEachWithoutException = (
  str: string,
  exceptionConfig?: {
    preposition?: boolean
    conjunction?: boolean
  }
) => {
  if (!str) {
    return str
  }

  const prepositionList = ["on", "at", "in", "by", "for", "with", "to"]
  const conjunctionList = ["and", "or", "but"]

  let exceptionList: string[] = []
  exceptionConfig?.conjunction && (exceptionList = exceptionList.concat(conjunctionList))
  exceptionConfig?.preposition && (exceptionList = exceptionList.concat(prepositionList))
  return str
    .split(" ")
    .map((_str: string) => (exceptionList.includes(_str) ? _str : capitalize(_str)))
    .join(" ")
}

export const transformPartLabelName = (part: string, isCapitalize?: boolean) => {
  let result: string
  switch (part) {
    case PartType.Hmi:
      result = part.toUpperCase()
      break
    case SENSOR_DIAGNOSIS_PART.MEASUREMENT_SPEED:
      result = "speed"
      break
    case SENSOR_DIAGNOSIS_PART.PEDAL_RPM:
      result = "cadence"
      break
    case SENSOR_DIAGNOSIS_PART.PEDAL_TORQUE_VALUE:
      result = "torque"
      break
    case PartType.Torque:
      result = "torque sensor"
      break
    default:
      result = part
  }

  return (isCapitalize ? capitalizeEachWithoutException(result) : result).replace(/_/g, " ")
}

export const getISODatetime = (date: Date) => {
  const ISODateTime = date.toISOString()
  const [datetime] = ISODateTime.split(".")
  return datetime
}
