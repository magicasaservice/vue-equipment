import { ref } from 'vue'

type Item = {
  index: number
  id: string
}

type CommandInstance = {
  id: string
  items: Item[]
  views: string[]
}

const commandStore = ref<CommandInstance[]>([])

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

  function sortItems(id: string, parent: HTMLElement) {
    const instance = findInstance(id)
    if (instance) {
      const itemElements: NodeListOf<HTMLElement> =
        parent.querySelectorAll('[data-id]')

      itemElements.forEach((el, index) => {
        const itemId = el.dataset.itemId
        const item = instance.items?.find((item) => item.id === itemId)

        if (item) {
          item.index = index
        }
      })

      instance.items?.sort((a, b) => a.index - b.index)
    }
  }

  function addItem(id: string, item: string) {
    const instance = findInstance(id)
    if (instance) {
      instance.items?.push({ index: -1, id: item })
    }
  }

  function removeItem(id: string, item: string) {
    const instance = findInstance(id)
    if (instance) {
      instance.items = instance.items?.filter((x) => x.id !== item)
    }
  }

  function addView(id: string, view: string) {
    const instance = findInstance(id)
    if (instance) {
      instance.views?.push(view)
    }
  }

  function removeView(id: string, view: string) {
    const instance = findInstance(id)
    if (instance) {
      instance.views = instance.views?.filter((x: string) => x !== view)
    }
  }

  return {
    commandStore,
    addInstance,
    findInstance,
    removeInstance,
    addItem,
    removeItem,
    sortItems,
    addView,
    removeView,
  }
}
