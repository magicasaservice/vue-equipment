import { ref, watch } from 'vue'

const activeView = ref<string | undefined>(undefined)
const lastActiveView = ref<string | undefined>(undefined)
const watcherActive = ref(false)

export function useCommandView() {
  // Public methods
  function selectView(id: string) {
    activeView.value = id
  }

  function selectLastView() {
    activeView.value = lastActiveView.value
  }

  if (!watcherActive.value) {
    watcherActive.value = true
    watch(activeView, (_newView, oldView) => {
      if (oldView) lastActiveView.value = oldView
    })
  }

  return {
    selectView,
    selectLastView,
    activeView,
    lastActiveView,
  }
}
