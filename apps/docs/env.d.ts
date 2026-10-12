/// <reference types="unplugin-icons/types/vue" />

declare module 'virtual:component-previews' {
  export type ComponentPreviewSource =
    import('./component-previews').ComponentPreviewSource

  const previews: Record<
    string,
    () => Promise<{ default: ComponentPreviewSource }>
  >
  export default previews
}
