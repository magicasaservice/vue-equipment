import { type MaybeRef } from 'vue'
import { useAccordionView } from './private/useAccordionView'

export function useMagicAccordion(id: MaybeRef<string>) {
  // Public functions
  const { selectView, unselectView } = useAccordionView(id)

  return {
    selectView,
    unselectView,
  }
}

export type UseMagicAccordionReturn = ReturnType<typeof useMagicAccordion>
