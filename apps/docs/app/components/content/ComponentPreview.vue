<template>
  <!-- The provider renders the frame itself. `as` rather than `as-child`,
       because a child carrying only static classes has its props object
       hoisted, and the slot primitive edits that object as it merges. -->
  <magic-accordion-provider
    :id="accordionId"
    as="figure"
    class="rounded-component-sm border-surface bg-surface-base relative mt-6 mb-10 overflow-hidden border-2 first:mt-0"
  >
    <!-- The demo stands on its own ground, one step above the panel that
         carries the code, and scrolls horizontally by itself so a wide example
         never widens the column. It mounts in the browser only: a demo that
         reads its provider’s state from the same template renders differently
         before and after hydration. -->
    <div
      class="bg-surface-high text-surface flex min-h-65 items-center justify-center overflow-x-auto px-4 py-8 sm:p-12"
    >
      <client-only>
        <component :is="preview" v-if="preview" />
        <p v-else class="docs-body-sm text-surface-muted">
          No preview registered for “{{ name }}”.
        </p>
      </client-only>
    </div>

    <figcaption
      v-if="source"
      class="border-surface flex items-center gap-x-1 border-t-2 px-1.5 py-1"
    >
      <span class="docs-code text-surface-muted px-2">
        {{ source.filename }}
      </span>

      <div class="ml-auto flex items-center gap-0.5">
        <docs-code-copy :value="source.code" />
      </div>
    </figcaption>

    <magic-accordion-view
      v-if="source"
      id="code"
      v-slot="{ viewActive }"
      as-child
    >
      <div>
        <!-- The pane is taken out of the flow, so the frame's height is the
             peek plus whatever the accordion has opened. MagicAccordion
             collapses its content to nothing, and the first lines of the
             example have to stay on screen, so what it animates here is the
             height below the peek rather than the code itself. -->
        <div :id="`${accordionId}-code`" class="relative overflow-hidden">
          <div ref="body" class="absolute inset-x-0 top-0">
            <pre
              class="shiki docs-code overflow-x-auto px-4 py-3.5"
              v-html="source.html"
            />
          </div>

          <div aria-hidden="true" :style="{ height: `${peek}px` }" />

          <magic-accordion-content>
            <div :style="{ height: `${rest}px` }" />
          </magic-accordion-content>

          <div
            v-if="overflowing && !viewActive"
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-(--app-color-surface-bg-base) to-transparent"
          />
        </div>

        <magic-accordion-trigger
          v-if="overflowing"
          type="button"
          class="docs-preview-more docs-caption text-surface-muted hover:text-surface hover:bg-surface-high border-surface flex h-10 w-full items-center justify-center border-t-2 transition-colors"
          :aria-expanded="viewActive"
          :aria-controls="`${accordionId}-code`"
        >
          {{ viewActive ? 'Hide code' : 'Show code' }}
        </magic-accordion-trigger>
      </div>
    </magic-accordion-view>
  </magic-accordion-provider>
</template>

<script setup lang="ts">
import previews from 'virtual:component-previews'

import type { ComponentPreviewSource } from 'virtual:component-previews'

interface ComponentPreviewProps {
  // The registered demo. The build fills it in from the `src` a page names.
  name?: string
}

const { name } = defineProps<ComponentPreviewProps>()

const preview = name ? resolveComponent(name) : undefined

// One accordion per frame, so two previews on a page never share a view.
const accordionId = `preview-${useId()}`

// The source comes from the demo file itself, through a module the build
// writes for it, so the pane always shows the file that renders above it.
const loadSource = name ? previews[name] : undefined
const source = shallowRef<ComponentPreviewSource | undefined>(
  loadSource ? (await loadSource()).default : undefined
)

// While the dev server runs, an edited demo sends its new source straight
// here, next to the hot update of the demo itself.
if (import.meta.hot) {
  const hot = import.meta.hot

  function onUpdate(update: { name: string; source: ComponentPreviewSource }) {
    if (update.name === name) {
      source.value = update.source
    }
  }

  hot.on('component-previews:update', onUpdate)
  onUnmounted(() => hot.off('component-previews:update', onUpdate))
}

/**
 * The pane is clipped to 240px unless it is shorter than that, so a four-line
 * example is not asked to hide two of its lines. The measurement is of the
 * whole pane, which is out of the flow and therefore never clipped itself.
 */
const peekHeight = 240

const height = ref(0)
const peek = computed(() =>
  height.value ? Math.min(height.value, peekHeight) : peekHeight
)
const rest = computed(() => Math.max(0, height.value - peek.value))
const overflowing = computed(() => !height.value || height.value > peekHeight)

const body = useTemplateRef('body')
let observer: ResizeObserver | undefined

function measure() {
  if (body.value) {
    height.value = body.value.offsetHeight
  }
}

onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  if (body.value) {
    observer.observe(body.value)
  }
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
@media (pointer: coarse) {
  .docs-preview-more {
    min-height: 2.75rem;
  }
}
</style>
