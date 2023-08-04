import { shallowReactive } from 'vue'

let modalsStore = shallowReactive<string[]>([])

function addIdToStore(id: string) {
  modalsStore.push(id)
}

function removeIdFromStore(id: string) {
  modalsStore = modalsStore.filter((x) => x !== id)
}

export { modalsStore, addIdToStore, removeIdFromStore }
