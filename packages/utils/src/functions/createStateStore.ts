import { getCurrentInstance, ref, type Ref } from 'vue'

export type CreateStore<T> = () => Ref<T>

export function createStateStore<T>(
  key: string,
  setInitialValue: () => T
): CreateStore<T> {
  return function getOrCreateStore(): Ref<T> {
    const instance = getCurrentInstance()
    const app = instance?.appContext.app

    // If no app instance is found, return a fresh store
    if (!app || !key) {
      return ref(setInitialValue()) as Ref<T>
    }

    // Create a global Map to hold all state stores
    if (!app.config.globalProperties.__VEStateStores) {
      app.config.globalProperties.__VEStateStores = new Map<string, Ref<T>>()
    }

    // Check if a store already exists for this app instance
    let store = app.config.globalProperties.__VEStateStores.get(key)

    // If no store exists for this app instance, create one
    if (!store) {
      store = ref(setInitialValue()) as Ref<T>
      app.config.globalProperties.__VEStateStores.set(key, store)
    }

    return store
  }
}
