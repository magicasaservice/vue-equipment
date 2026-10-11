/**
 * Shared between `nuxt.config.ts` and the toggle, so the cross-tab `storage`
 * listener and the module cannot disagree about which key to watch.
 */
export const colorModeStorageKey = 'vue-equipment-docs-color-mode'
