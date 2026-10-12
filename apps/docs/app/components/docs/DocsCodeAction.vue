<template>
  <button
    type="button"
    class="docs-action rounded-component-compact-sm flex size-8 items-center justify-center transition-colors"
    :class="
      active
        ? 'bg-accent-subtle text-surface'
        : 'text-surface-muted hover:text-surface hover:bg-surface-higher'
    "
    :aria-label="label"
    :aria-pressed="active"
    :title="label"
  >
    <base-icon v-if="icon" :name="icon" aria-hidden="true" class="size-4" />
    <!-- The slot shell stays for the one glyph the symbol set has no
         counterpart for: ProsePre's line-wrap mark. -->
    <svg
      v-else
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="size-4"
    >
      <slot />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
  icon?: 'check' | 'copy-clipboard'
}>()
</script>

<style scoped>
/* A 32px box holding a 16px mark, the same as the top bar’s buttons. A finger
   needs 44, so the target grows on a coarse pointer without moving the glyph. */
@media (pointer: coarse) {
  .docs-action {
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
}
</style>
