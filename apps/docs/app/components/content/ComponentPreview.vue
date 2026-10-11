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
      class="border-surface flex flex-wrap items-center gap-x-1 border-t-2 px-1.5 py-1"
    >
      <div v-if="sources.length > 1" class="flex items-center gap-0.5">
        <button
          v-for="(source, index) in sources"
          :key="source.name"
          type="button"
          class="docs-preview-tab rounded-component-compact-sm docs-code flex h-8 items-center px-2 transition-colors"
          :class="
            index === activeIndex
              ? 'bg-surface-higher text-surface'
              : 'text-surface-muted hover:text-surface'
          "
          :aria-pressed="index === activeIndex"
          @click="activeIndex = index"
        >
          {{ source.name }}
        </button>
      </div>
      <span
        v-else-if="sources.length === 1"
        class="docs-code text-surface-muted px-2"
        >{{ sources[0]!.name }}</span
      >

      <div class="ml-auto flex items-center gap-0.5">
        <docs-code-copy
          v-if="sources.length"
          :value="sources[activeIndex]?.code"
        />
      </div>
    </figcaption>

    <magic-accordion-view
      v-if="sources.length"
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
          <!-- Nothing rides over the code any more: the copy button lives on
               the toolbar, so a horizontally scrolled line has the pane to
               itself and cannot pass under an icon. -->
          <div ref="body" class="absolute inset-x-0 top-0">
            <component :is="activeSource" />
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
import { cloneVNode, isVNode } from 'vue'
import type { VNode } from 'vue'

interface ComponentPreviewProps {
  // The registered demo. The build fills it in from the `src` a page names,
  // together with the demo’s source as the fence below.
  name?: string
}

const { name } = defineProps<ComponentPreviewProps>()

const preview = name ? resolveComponent(name) : undefined

// One accordion per frame, so two previews on a page never share a view.
const accordionId = `preview-${useId()}`

/**
 * The source panes are the fences inside the block, which the build writes
 * from the demo files. Reading them off the slot vnodes keeps the tab labels,
 * the pane contents and the copy value derived from one place, and keeps the
 * build-time Shiki output rather than re-highlighting at runtime.
 */
const slots = useSlots()

const fileNames: Record<string, string> = {
  vue: 'App.vue',
  css: 'styles.css',
  html: 'index.html',
  ts: 'main.ts',
  typescript: 'main.ts',
}

interface PreviewSource {
  name: string
  code: string
  vnode: VNode
}

function collect(nodes: unknown, into: Array<PreviewSource>) {
  if (!Array.isArray(nodes)) {
    return
  }
  for (const node of nodes) {
    if (!isVNode(node)) {
      continue
    }
    const props = (node.props ?? {}) as Record<string, unknown>
    if (typeof props.code === 'string') {
      const language = typeof props.language === 'string' ? props.language : ''
      into.push({
        name:
          (typeof props.filename === 'string' && props.filename) ||
          fileNames[language] ||
          'Source',
        code: props.code,
        vnode: node,
      })
      continue
    }
    const children = node.children
    if (Array.isArray(children)) {
      collect(children, into)
    } else if (children && typeof children === 'object') {
      const slot = (children as Record<string, unknown>).default
      if (typeof slot === 'function') {
        collect(slot(), into)
      }
    }
  }
}

const sources = computed(() => {
  const found: Array<PreviewSource> = []
  collect(slots.default?.(), found)
  return found
})

const activeIndex = ref(0)

const activeSource = computed(() => {
  const source = sources.value[activeIndex.value]
  return source ? () => cloneVNode(source.vnode, { bare: true }) : undefined
})

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

watch(activeIndex, () => nextTick(measure))
</script>

<style scoped>
@media (pointer: coarse) {
  .docs-preview-tab,
  .docs-preview-more {
    min-height: 2.75rem;
  }
}
</style>
