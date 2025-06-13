export type ComponentCardData = {
  id: string
  partType: string
  img: string
  marketingName?: string
  description?: string
  statusInfo: {
    isCommunication: boolean
  }
  sparePartInfo?: {
    sparePartIndex: number
    sparePartAmount: number
  }
  infoList?: {
    label: string
    value: string
  }[]
}
