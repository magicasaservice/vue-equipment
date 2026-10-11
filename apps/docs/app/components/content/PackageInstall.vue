<template>
  <!-- Fill, not border. The manager tabs sit inside the same panel as the
       command so the block reads as one object. -->
  <div
    class="rounded-component-sm bg-surface-high mt-6 mb-6 overflow-hidden first:mt-0"
  >
    <div class="flex items-center gap-1 px-2 pt-2">
      <button
        v-for="manager in managers"
        :key="manager.name"
        type="button"
        class="rounded-component-compact-sm docs-code docs-tap-grow inline-flex items-center px-2 py-1 transition-colors"
        :class="
          active === manager.name
            ? 'bg-surface-higher text-surface'
            : 'text-surface-muted hover:text-surface'
        "
        :aria-pressed="active === manager.name"
        @click="active = manager.name"
      >
        {{ manager.name }}
      </button>

      <docs-code-copy :value="command" class="ml-auto" />
    </div>

    <pre class="docs-code text-surface overflow-x-auto px-4 pt-2.5 pb-3.5">{{
      command
    }}</pre>
  </div>
</template>

<script setup lang="ts">
interface PackageInstallProps {
  // One package or several, separated by spaces.
  name?: string
  dev?: boolean
}

const { name = '@maas/vue-equipment', dev = false } =
  defineProps<PackageInstallProps>()

const managers = [
  { name: 'pnpm', add: 'pnpm add', devFlag: '-D' },
  { name: 'npm', add: 'npm install', devFlag: '--save-dev' },
  { name: 'yarn', add: 'yarn add', devFlag: '--dev' },
  { name: 'bun', add: 'bun add', devFlag: '-d' },
]

/**
 * The choice is shared across every install block on the page, so picking
 * `pnpm` once switches all of them. The reader never sets it twice.
 */
const active = useState('package-manager', () => 'pnpm')

const command = computed(() => {
  const manager = managers.find((entry) => entry.name === active.value)
  if (!manager) {
    return ''
  }
  return dev
    ? `${manager.add} ${manager.devFlag} ${name}`
    : `${manager.add} ${name}`
})
</script>
