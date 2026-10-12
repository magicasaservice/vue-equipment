<template>
  <!-- Not a box. A callout is an aside inside the prose, so it takes a quiet
       fill in its own tone and marks its kind with the icon. A Note should
       never be louder than the demo it annotates. -->
  <aside
    class="docs-callout rounded-component-sm mt-6 mb-6 flex gap-3 px-4 py-3.5 first:mt-0"
    :class="tone.fill"
  >
    <base-icon
      :name="tone.icon"
      aria-hidden="true"
      class="mt-0.5 size-4 shrink-0"
      :class="tone.mark"
    />

    <!-- The kind is announced, not printed: the fill and the mark carry it for
         anyone who can see them. It sits outside the prose so it does not
         count as the first child and push the real first line down. -->
    <span class="sr-only">{{ tone.title }}</span>

    <div class="text-surface min-w-0 flex-1 *:first:mt-0 *:last:mb-0">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
const { type = 'note' } = defineProps<{
  type?: 'note' | 'tip' | 'warning' | 'caution'
}>()

const tones = {
  note: {
    title: 'Note',
    icon: 'sign-info-oval',
    fill: 'bg-surface-high',
    mark: 'text-surface-muted',
  },
  tip: {
    title: 'Tip',
    icon: 'check-oval',
    fill: 'bg-success-subtle',
    mark: 'text-success-solid',
  },
  warning: {
    title: 'Warning',
    icon: 'sign-warning-oval',
    fill: 'bg-warning-subtle',
    mark: 'text-warning-solid',
  },
  caution: {
    title: 'Caution',
    icon: 'sign-warning-oval',
    fill: 'bg-danger-subtle',
    mark: 'text-danger-solid',
  },
} as const

const tone = computed(() => tones[type])
</script>
