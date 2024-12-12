import { ref } from 'vue'

const modalStore = ref<string[]>([])

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
