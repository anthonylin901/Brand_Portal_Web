import { usePostBundleStore } from "@/stores/use-post-bundle-store"
import { useInstructionStore } from "@/stores/use-instruction-store"
import { useBikeStore } from "@/stores/use-bike-store"
import { useUserStore } from "@/stores/use-user-store"
import { useTeamMembersStore } from "@/stores/use-team-members-store"
import { useCaseStore } from "@/stores/use-case-store"
import { useEnumerationStore } from "@/stores/use-enumeration-store"

const postBundleStore = usePostBundleStore()
const instructionStore = useInstructionStore()
const bikeStore = useBikeStore()
const userStore = useUserStore()
const teamMembersStore = useTeamMembersStore()
const caseStore = useCaseStore()
const enumerationStore = useEnumerationStore()

export {
  postBundleStore,
  instructionStore,
  bikeStore,
  userStore,
  teamMembersStore,
  caseStore,
  enumerationStore,
}
