<template>
  <magic-drawer :id="navigationDrawerId" :options="drawerOptions">
    <div
      id="docs-navigation-panel"
      class="bg-surface-base flex h-full w-full flex-col"
    >
      <div
        class="border-b-surface flex h-(--docs-header) shrink-0 items-center gap-2 border-b px-(--docs-gutter)"
      >
        <base-icon
          name="carabiner"
          aria-hidden="true"
          class="text-surface size-6 shrink-0"
        />

        <button
          type="button"
          aria-label="Close the menu"
          class="text-surface-muted hover:text-surface hover:bg-primary-muted active:bg-primary-muted-hover rounded-component-2xs -mr-2.5 ml-auto flex size-11 shrink-0 items-center justify-center transition-colors sm:mr-0 sm:size-8"
          @click="close"
        >
          <base-icon name="close" aria-hidden="true" class="size-4" />
        </button>
      </div>

      <!-- The drawer tells a scroll from a drag by the overflow a container
           declares, so this one has to say `auto` itself. -->
      <div
        ref="scroller"
        class="relative min-h-0 flex-1 scrollbar-none overflow-y-auto px-(--docs-gutter) py-6"
      >
        <docs-sidebar-nav :navigation="navigation ?? []" />
        <docs-sidebar-links class="mt-8" />
      </div>
    </div>
  </magic-drawer>
</template>

<script setup lang="ts">
import type { MagicDrawerOptions } from '@maas/vue-equipment/plugins/MagicDrawer'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

const { data: navigation } = await useDocsNavigation()

// It opens from the side the menu button sits on, so the close button lands
// where the menu button was. Closing hands the focus back to that button.
const drawerOptions: MagicDrawerOptions = {
  position: 'right',
  focusTrap: {
    initialFocus: false,
    allowOutsideClick: true,
    setReturnFocus: `[data-id="${navigationDrawerId}-trigger"]`,
  },
}

const { close } = useMagicDrawer(navigationDrawerId)

// The drawer opens on whatever page the reader is on, so it opens showing that
// page rather than at the top of a tree they then have to scan. The scroller
// is moved directly, because scrolling the item into view would also move
// the page the drawer has locked.
const scroller = useTemplateRef('scroller')
const emitter = useMagicEmitter()

function onEnter(payload: MagicEmitterEvents['enter']) {
  if (payload !== navigationDrawerId || !scroller.value) {
    return
  }
  const item = scroller.value.querySelector<HTMLElement>('[data-nav-active]')
  if (item) {
    scroller.value.scrollTop =
      item.offsetTop - (scroller.value.clientHeight - item.offsetHeight) / 2
  }
}

emitter.on('enter', onEnter)
onBeforeUnmount(() => emitter.off('enter', onEnter))

const route = useRoute()
watch(
  () => route.fullPath,
  () => close()
)
</script>
