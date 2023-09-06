import { ref } from 'vue'

let modalStore = ref<string[]>([])

export function useModalStore() {
  function addIdToStore(id: string) {
    modalStore.value.push(id)
  }

  function removeIdFromStore(id: string) {
    modalStore.value = modalStore.value.filter((x: string) => x !== id)
  }

  return {
    modalStore,
    addIdToStore,
    removeIdFromStore,
  }
}
