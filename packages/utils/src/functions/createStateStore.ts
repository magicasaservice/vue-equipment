import { getCurrentInstance, ref, type App, type Ref } from 'vue'

export type CreateStore<T> = () => Ref<T>

export function createStateStore<T>(setInitialValue: () => T): CreateStore<T> {
  const storesMap = new WeakMap<App, Ref<T>>()

  return function getOrCreateStore(): Ref<T> {
    const instance = getCurrentInstance()
    const app = instance?.appContext.app

    // If no app instance is found, return a fresh store
    if (!app) {
      return ref(setInitialValue()) as Ref<T>
    }

    // Check if a store already exists for this app instance
    let store = storesMap.get(app)

    // If no store exists for this app instance, create one
    if (!store) {
      store = ref(setInitialValue()) as Ref<T>
      storesMap.set(app, store)
    }

    return store
  }
}
