<template>
  <!-- One control, not a three-up segmented group. `system` is the preference
       until someone states one, and stating one is what this button does; the
       reader who never touches it keeps following the OS. -->
  <button
    type="button"
    class="text-surface-muted hover:text-surface hover:bg-primary-muted active:bg-primary-muted-hover rounded-component-2xs flex size-11 shrink-0 items-center justify-center transition-colors sm:size-8"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <!-- Both symbols render, and the attribute the color mode script sets
         before the first paint picks one, so the right one shows from the
         first frame rather than once the page has hydrated. -->
    <base-icon name="moon" aria-hidden="true" class="size-4 dark:hidden" />
    <base-icon name="sun" aria-hidden="true" class="hidden size-4 dark:block" />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const next = computed(() => (isDark.value ? 'light' : 'dark'))

/**
 * The color mode is only known once the module's inline script has run, which
 * is after the server rendered this button. Everything that depends on it waits
 * for mount, so the two renders are identical and hydration has nothing to
 * rectify. Until then the button is labeled for what it does, not for where
 * it is going.
 */
const settled = ref(false)
onMounted(() => {
  settled.value = true
})

const label = computed(() =>
  settled.value ? `Switch to ${next.value} mode` : 'Switch the color mode'
)

function toggle() {
  colorMode.preference = next.value
}

/**
 * `@nuxtjs/color-mode` already follows the OS while "system" is selected. What
 * it does not do is notice a change made in another tab, so a second window
 * keeps the stale mode until it reloads.
 */
onMounted(() => {
  function syncFromStorage(event: StorageEvent) {
    if (event.key !== colorModeStorageKey || !event.newValue) {
      return
    }
    if (event.newValue === colorMode.preference) {
      return
    }
    colorMode.preference = event.newValue
  }

  window.addEventListener('storage', syncFromStorage)

  onUnmounted(() => {
    window.removeEventListener('storage', syncFromStorage)
  })
})
</script>
