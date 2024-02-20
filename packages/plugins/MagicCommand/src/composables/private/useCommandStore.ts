import { ref } from 'vue'

type CommandInstance = {
  id: string
  items: string[]
  views: string[]
}

let commandStore = ref<CommandInstance[]>([])

export function useCommandStore() {
  function addInstance(id: string) {
    commandStore.value.push({ id, items: [], views: [] })
  }

  function findInstance(id: string) {
    const instance = commandStore.value.find((instance) => {
      return instance.id === id
    })
    return instance as CommandInstance
  }

  function removeInstance(id: string) {
    commandStore.value = commandStore.value.filter(
      (x: CommandInstance) => x.id !== id
    )
  }

  function addItem(id: string, item: string) {
    const instance = findInstance(id)
    instance.items.push(item)
  }

  function removeItem(id: string, item: string) {
    const instance = findInstance(id)
    if (instance) {
      instance.items = instance.items.filter((x: string) => x !== item)
    }
  }

  function addView(id: string, view: string) {
    const instance = findInstance(id)
    instance.views.push(view)
  }

  function removeView(id: string, view: string) {
    const instance = findInstance(id)
    if (instance) {
      instance.views = instance.views.filter((x: string) => x !== view)
    }
  }

  return {
    commandStore,
    addInstance,
    findInstance,
    removeInstance,
    addItem,
    removeItem,
    addView,
    removeView,
  }
}
