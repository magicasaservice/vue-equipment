import { ref } from 'vue'

let drawerStore = ref<string[]>([])

export function useDrawerStore() {
  function addInstance(id: string) {
    drawerStore.value.push(id)
  }

  function removeInstance(id: string) {
    drawerStore.value = drawerStore.value.filter((x: string) => x !== id)
  }

  return {
    drawerStore,
    addInstance,
    removeInstance,
  }
}
