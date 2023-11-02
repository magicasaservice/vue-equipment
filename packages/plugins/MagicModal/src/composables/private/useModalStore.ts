import { ref } from 'vue'

let modalStore = ref<string[]>([])

export function useModalStore() {
  function addInstance(id: string) {
    modalStore.value.push(id)
  }

  function removeInstance(id: string) {
    modalStore.value = modalStore.value.filter((x: string) => x !== id)
  }

  return {
    modalStore,
    addInstance,
    removeInstance,
  }
}
