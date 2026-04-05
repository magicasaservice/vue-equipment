import { createApp, nextTick, type Component } from 'vue'

/**
 * Mount a Vue component using createApp directly.
 * vitest-browser-vue's render() breaks Vue <transition> hooks,
 * so we use this for tests that need transition lifecycle events.
 */
export function mountWithApp(component: Component) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const app = createApp(component)
  app.mount(container)

  return {
    container,
    unmount() {
      app.unmount()
      document.body.removeChild(container)
    },
    async getByTestId(id: string) {
      await nextTick()
      return container.querySelector(`[data-testid="${id}"]`) as HTMLElement
    },
  }
}
