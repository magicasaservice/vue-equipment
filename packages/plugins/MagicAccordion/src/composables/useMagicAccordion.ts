import { type MaybeRef } from 'vue'
import { useAccordionView } from './private/useAccordionView'

interface UseMagicAccordionArgs {
  instanceId: MaybeRef<string>
}

export function useMagicAccordion(args: UseMagicAccordionArgs) {
  const { instanceId } = args

  // Public functions
  const { selectView, unselectView } = useAccordionView(instanceId)

  return {
    selectView,
    unselectView,
  }
}

export type UseMagicAccordionReturn = ReturnType<typeof useMagicAccordion>
