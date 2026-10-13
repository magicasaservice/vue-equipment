<template>
  <!-- Fill, not border. The manager tabs sit inside the same panel as the
       command so the block reads as one object. -->
  <mirror-tabs-root
    v-model="active"
    class="rounded-component-sm bg-surface-high mt-6 mb-6 overflow-hidden first:mt-0"
  >
    <!-- The tabs and the copy button sit in the block's top corners, so both
         take the corner inset and its radius and start at the top of the
         row. -->
    <div class="flex items-start gap-2 px-(--docs-inset) pt-(--docs-inset)">
      <!-- The indicator only renders once it has measured the active tab,
           after mount. Until then the active tab carries the same fill, so
           the server-rendered block already shows the selection. -->
      <mirror-tabs-list
        :class="list"
        class="[&:not(:has(>.mirror-tabs-indicator))>[data-active]]:bg-primary-muted"
        aria-label="Package manager"
      >
        <mirror-tabs-tab
          v-for="manager in managers"
          :key="manager.name"
          :class="trigger"
          :value="manager.name"
        >
          {{ manager.name }}
        </mirror-tabs-tab>

        <mirror-tabs-indicator :class="indicator" />
      </mirror-tabs-list>

      <docs-code-copy :value="command" class="ml-auto" />
    </div>

    <mirror-tabs-content
      v-for="manager in managers"
      :key="manager.name"
      :value="manager.name"
    >
      <pre class="docs-code text-surface overflow-x-auto px-4 pt-2.5 pb-3.5">{{
        commandFor(manager)
      }}</pre>
    </mirror-tabs-content>
  </mirror-tabs-root>
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

function commandFor(manager: (typeof managers)[number]) {
  return dev
    ? `${manager.add} ${manager.devFlag} ${name}`
    : `${manager.add} ${name}`
}

// The copy button copies whichever command is showing.
const command = computed(() => {
  const manager = managers.find((entry) => entry.name === active.value)
  return manager ? commandFor(manager) : ''
})

// The tabs keep the docs’ code face, set at the caption size, and take their
// color states from Mirror’s tabs demo. They fit their labels, so the
// indicator follows the width as well as the position.
const list = 'relative isolate flex items-center gap-1'

const trigger = [
  'rounded-(--docs-inset-radius) docs-code docs-tap-grow relative z-10',
  'text-(length:--app-font-size-surface-caption)',
  'inline-flex h-7 items-center px-1.5 text-surface-muted',
  'transition-colors duration-200 ease-in-out',
  'data-[active=true]:text-surface',
  'enabled:not-data-[active=true]:hover:bg-primary-subtle',
  'enabled:not-data-[active=true]:hover:text-surface',
  'enabled:not-data-[active=true]:active:bg-primary-subtle-hover',
].join(' ')

const indicator = [
  'rounded-(--docs-inset-radius) bg-primary-muted',
  'left-0! translate-x-[var(--mirror-tabs-indicator-left)]',
  'transition-[translate,inline-size] duration-200 ease-out',
].join(' ')
</script>
