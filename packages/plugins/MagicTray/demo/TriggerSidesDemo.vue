<template>
  <div
    class="bg-surface-low text-surface rounded-surface-lg relative isolate aspect-[402/874] w-72 max-w-full overflow-clip select-none"
  >
    <magic-tray-trigger :id="id" side="left" as-child>
      <aside
        class="absolute inset-y-0 left-0 flex w-56 flex-col pt-7 pb-4"
        :style="panelStyles.left"
      >
        <div class="flex items-center justify-between px-4">
          <span class="type-surface-callout-md">Vue Equipment</span>
          <span
            class="bg-surface-base flex size-8 items-center justify-center rounded-full"
          >
            <svg v-bind="svg" class="size-4"><path :d="icons.search" /></svg>
          </span>
        </div>
        <ul class="mt-3 flex flex-col px-2">
          <li v-for="item in nav" :key="item.label">
            <button
              class="type-surface-body-sm flex w-full items-center gap-3 px-2 py-2 text-left"
            >
              <svg v-bind="svg" class="size-4 shrink-0">
                <path :d="item.icon" />
              </svg>
              {{ item.label }}
            </button>
          </li>
        </ul>
        <div class="type-surface-caption text-surface-subtle mt-4 px-4">
          Recents
        </div>
        <ul class="mt-1 flex flex-col px-2">
          <li v-for="chat in chats" :key="chat">
            <button
              class="type-surface-body-sm rounded-component-sm flex w-full items-center gap-3 px-2 py-2 text-left"
              :class="{ 'bg-surface-base': chat === selected }"
              @click="selected = chat"
            >
              <svg v-bind="svg" class="size-4 shrink-0">
                <path :d="icons.chat" />
              </svg>
              <span class="truncate">{{ chat }}</span>
            </button>
          </li>
        </ul>
        <div class="mt-auto flex items-center justify-between px-4 pt-3">
          <span
            class="bg-surface-base type-surface-caption flex size-8 items-center justify-center rounded-full"
          >
            VE
          </span>
          <m-button size="sm">New chat</m-button>
        </div>
      </aside>
    </magic-tray-trigger>
    <magic-tray-trigger :id="id" side="right" as-child>
      <aside
        class="absolute inset-y-0 right-0 flex w-48 flex-col pt-7 pb-4"
        :style="panelStyles.right"
      >
        <div class="flex h-8 items-center px-4">
          <span class="type-surface-callout-md">Tools</span>
        </div>
        <ul class="mt-3 flex flex-col px-2">
          <li v-for="tool in tools" :key="tool.label">
            <button
              class="type-surface-body-sm rounded-component-sm flex w-full items-center gap-3 px-2 py-2 text-left"
              @click="tool.enabled = !tool.enabled"
            >
              <svg v-bind="svg" class="size-4 shrink-0">
                <path :d="tool.icon" />
              </svg>
              <span class="flex-1 truncate">{{ tool.label }}</span>
              <span
                class="flex h-4 w-7 shrink-0 items-center rounded-full px-0.5"
                :class="tool.enabled ? 'bg-surface-high' : 'bg-surface-base'"
              >
                <span
                  class="bg-surface-low size-3 rounded-full"
                  :class="{ 'translate-x-3': tool.enabled }"
                />
              </span>
            </button>
          </li>
        </ul>
        <div class="type-surface-caption text-surface-subtle mt-4 px-4">
          Model
        </div>
        <ul class="mt-1 flex flex-col px-2">
          <li v-for="model in models" :key="model">
            <button
              class="type-surface-body-sm rounded-component-sm flex w-full items-center gap-3 px-2 py-2 text-left"
              :class="{ 'bg-surface-base': model === selectedModel }"
              @click="selectedModel = model"
            >
              <span class="truncate">{{ model }}</span>
            </button>
          </li>
        </ul>
        <div class="mt-auto px-4 pt-3">
          <m-button size="sm" class="w-full">Clear chat</m-button>
        </div>
      </aside>
    </magic-tray-trigger>
    <magic-tray-provider :id="id" :options="options">
      <magic-tray-content
        :style="{ '--magic-tray-radius': 'var(--radius-surface-lg)' }"
      >
        <template #background>
          <div class="bg-surface-base h-full w-full" />
        </template>
        <magic-tray-transform axis="x" class="h-full">
          <magic-tray-trigger
            :side="['left', 'right']"
            :disabled="touchIntent.isScrolling"
            as-child
          >
            <div ref="content" class="flex h-full w-full flex-col">
              <header class="flex items-center gap-3 px-4 pt-6 pb-3">
                <button
                  class="bg-surface-high flex size-8 shrink-0 items-center justify-center rounded-full"
                  @click="toggle('left')"
                >
                  <svg v-bind="svg" class="size-4">
                    <path :d="icons.menu" />
                  </svg>
                </button>
                <span class="type-surface-callout-md flex-1 truncate">{{
                  selected
                }}</span>
                <button
                  class="bg-surface-high flex size-8 shrink-0 items-center justify-center rounded-full"
                  @click="toggle('right')"
                >
                  <svg v-bind="svg" class="size-4">
                    <path :d="icons.sliders" />
                  </svg>
                </button>
              </header>
              <div
                ref="chat"
                class="type-surface-body-sm flex min-h-0 flex-1 touch-pan-y flex-col gap-3 overflow-y-auto overscroll-contain px-5 pb-3"
              >
                <p
                  v-for="(message, index) in messages"
                  :key="index"
                  :class="{
                    'bg-surface-high rounded-component-xl max-w-[85%] shrink-0 self-end px-3.5 py-2':
                      message.role === 'user',
                    'text-surface-muted shrink-0': message.role === 'bot',
                  }"
                >
                  {{ message.text }}
                </p>
              </div>
              <div class="px-4 pb-4">
                <div
                  class="bg-surface-high text-surface-muted type-surface-body-sm flex items-center gap-2 rounded-full px-4 py-2.5"
                >
                  <svg v-bind="svg" class="size-4">
                    <path :d="icons.plus" />
                  </svg>
                  Ask anything
                </div>
              </div>
            </div>
          </magic-tray-trigger>
        </magic-tray-transform>
      </magic-tray-content>
    </magic-tray-provider>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import { useTouchIntent } from '@maas/vue-equipment/composables/useTouchIntent'

import type { CSSProperties, SVGAttributes } from 'vue'
import type {
  MagicTrayOptions,
  MagicTraySnapPoint,
} from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-trigger-sides-demo'

const svg: SVGAttributes = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

const icons = {
  search: 'M10.5 10.5 13.5 13.5M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
  menu: 'M3 5h10M3 8h10M3 11h10',
  sliders: 'M2 4.5h12M2 8h12M2 11.5h12M6 3v3M10.5 6.5v3M5 10v3',
  plus: 'M8 3v10M3 8h10',
  folder:
    'M2 4.5A1.5 1.5 0 0 1 3.5 3h3L8 4.5h4.5A1.5 1.5 0 0 1 14 6v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z',
  code: 'm5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5 14 8l-3.5 3.5',
  clock: 'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12ZM8 5v3l2.5 1.5',
  chat: 'M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11h-.5A1.5 1.5 0 0 1 3 9.5z',
  globe:
    'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12ZM2 8h12M8 2c-2 2-2 10 0 12M8 2c2 2 2 10 0 12',
  bookmark: 'M4 2.5h8v11l-4-3-4 3z',
}

const nav = [
  { label: 'Projects', icon: icons.folder },
  { label: 'Code', icon: icons.code },
  { label: 'Scheduled', icon: icons.clock },
]

const chats = [
  'Opening the tools',
  'Plan a weekend in Lisbon',
  'Explain clip-path insets',
  'Sourdough starter schedule',
  'Rename these variables',
  'Draft a release note',
]

const selected = ref('Opening the tools')

const messages: Array<{ role: 'user' | 'bot'; text: string }> = [
  { role: 'user', text: 'Can I open the sidebar from here?' },
  { role: 'bot', text: 'Yes. Drag this view to the right.' },
  { role: 'user', text: 'And the tools?' },
  {
    role: 'bot',
    text: 'Drag it to the left. The first move picks the side, so a drag never opens both.',
  },
  { role: 'user', text: 'How do I close them?' },
  { role: 'bot', text: 'Drag toward the open one, or drag the panel itself.' },
  { role: 'user', text: 'What if I scroll this chat?' },
  {
    role: 'bot',
    text: 'Nothing opens. A move up or down counts as a scroll and disables the trigger until you let go.',
  },
  { role: 'user', text: 'And a diagonal drag?' },
  {
    role: 'bot',
    text: 'Whichever way it leans. Sideways drags a side, up or down scrolls.',
  },
  { role: 'user', text: 'Does a tap do anything?' },
  {
    role: 'bot',
    text: 'No. A press without a move starts nothing, so taps reach the buttons underneath.',
  },
  { role: 'user', text: 'How do I open the tools?' },
  {
    role: 'bot',
    text: 'Drag this view to the left. Drag it to the right for the sidebar, and drag either one back to close it.',
  },
]

const content = ref<HTMLElement>()
const chat = ref<HTMLElement>()

const touchIntent = useTouchIntent({ target: content })

onMounted(() => {
  chat.value?.scrollTo({ top: chat.value.scrollHeight })
})

const tools = reactive([
  { label: 'Web search', icon: icons.globe, enabled: true },
  { label: 'Code', icon: icons.code, enabled: true },
  { label: 'Files', icon: icons.folder, enabled: false },
  { label: 'Memory', icon: icons.bookmark, enabled: false },
])

const models = ['Fast', 'Balanced', 'Thorough']

const selectedModel = ref('Balanced')

const widths = { left: 224, right: 192 }

const options: MagicTrayOptions = {
  snapPoints: {
    left: [0, `${widths.left}px`],
    right: [0, `${widths.right}px`],
  },
  threshold: { distance: 32 },
  handles: false,
  inset: true,
}

const { activeSnapPoint, state, snapTo } = useMagicTray(id, options)

function toggle(side: 'left' | 'right') {
  const isOpen = (activeSnapPoint.value[side] ?? 0) !== 0
  const open: MagicTraySnapPoint = `${widths[side]}px`

  snapTo(side, isOpen ? 0 : open)
}

function reveal(side: 'left' | 'right') {
  const inset = state.dragged[side] - state.overshoot.outer[side]

  return Math.min(1, Math.max(0, inset / widths[side]))
}

function panelStyle(own: number, other: number): CSSProperties {
  return {
    opacity: own,
    visibility: own === 0 ? 'hidden' : 'visible',
    zIndex: own >= other ? 0 : -1,
  }
}

const panelStyles = computed(() => {
  const left = reveal('left')
  const right = reveal('right')

  return {
    left: panelStyle(left, right),
    right: panelStyle(right, left),
  }
})
</script>
