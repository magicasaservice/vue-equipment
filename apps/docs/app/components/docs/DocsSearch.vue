<template>
  <magic-command-provider :id="commandId" :options="commandOptions">
    <magic-command-trigger :view-id="viewId" as-child>
      <button
        type="button"
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        title="Search"
        class="text-surface-muted hover:text-surface hover:bg-primary-muted active:bg-primary-muted-hover rounded-component-2xs flex size-11 shrink-0 items-center justify-center transition-colors sm:size-8"
      >
        <base-icon name="magnifier" aria-hidden="true" class="size-4" />
      </button>
    </magic-command-trigger>

    <!-- The palette is a panel lifted by its shadow, and it keeps a fixed
         height: the command content is positioned inside the renderer, and a
         box that does not resize on every keystroke is what a list wants
         under a pointer anyway. Its radius follows the v1 menu box formula,
         the row's own radius plus the 4px the list is inset by, so the rows
         nest inside the corner instead of cutting across it. The fill is
         `surface-higher`, one rung above the panels on the page beneath it:
         `bg-primary-inverted` lands on the same value as a panel, and in dark
         a shadow does not separate a floating box from its ground. -->
    <magic-command-modal class="docs-search-modal">
      <div
        class="bg-surface-higher rounded-component-lg shadow-component-high mt-[10svh] flex h-[26rem] max-h-[70svh] w-[calc(100%-2rem)] max-w-[34rem] overflow-hidden"
      >
        <magic-command-renderer />
      </div>
    </magic-command-modal>

    <magic-command-view :id="viewId" :initial="true">
      <magic-command-content class="flex flex-col">
        <div class="flex h-14 shrink-0 items-center gap-2.5 px-4.5">
          <base-icon
            name="magnifier"
            aria-hidden="true"
            class="text-surface-muted size-4 shrink-0"
          />

          <input
            ref="input"
            v-model="query"
            type="text"
            autocomplete="off"
            spellcheck="false"
            aria-label="Search the documentation"
            placeholder="Search pages and sections"
            class="docs-body text-surface placeholder:text-surface-muted h-full min-w-0 flex-1 bg-transparent outline-none"
          />

          <kbd
            class="docs-code text-surface-muted rounded-component-compact-sm bg-primary-subtle shrink-0 px-1.5 py-0.5"
          >
            Esc
          </kbd>
        </div>

        <!-- Results are grouped under the page they live on, so a page name is
             printed once instead of on every section that matched. Each row is
             a real link, so the palette costs the reader nothing that a list of
             links would not already give them. -->
        <div
          v-if="groups.length"
          class="min-h-0 flex-1 scrollbar-none overflow-y-auto px-1 pb-2"
        >
          <div v-for="group in groups" :key="group.path">
            <p class="docs-label pt-2 pb-1 pl-3.5">{{ group.title }}</p>

            <magic-command-item
              v-for="result in group.results"
              :key="result.id"
              v-slot="{ itemActive }"
              :initial="result.index === 0"
              @enter="go(result)"
            >
              <docs-menu-item :to="result.id" size="xs" :active="itemActive">
                {{ result.title }}

                <!-- The headings between the row and its page. It is the
                     menu item's cmd slot: set on the right, muted at rest and
                     solid on the row the arrows are on. The slot carries
                     tabular figures for the key hints it was drawn for, which
                     widens the word space in prose, so this one opts out. -->
                <template v-if="result.detail" #cmd>
                  <span class="max-w-40 truncate normal-nums">
                    {{ result.detail }}
                  </span>
                </template>
              </docs-menu-item>
            </magic-command-item>
          </div>
        </div>

        <p v-else class="docs-body-sm text-surface-muted px-4 py-8 text-center">
          {{
            query.trim()
              ? `Nothing matches “${query.trim()}”.`
              : 'Type to search.'
          }}
        </p>
      </magic-command-content>
    </magic-command-view>
  </magic-command-provider>
</template>

<script setup lang="ts">
interface SearchResult {
  id: string
  title: string
  detail: string
  score: number
  depth: number
  path: string
  index: number
}

const commandId = 'docs-search'
const viewId = 'docs-search-view'

// The palette's own defaults are the ones the docs want already: ⌘K and Ctrl+K
// open it, Escape closes it, the arrows move and Enter follows. All that is
// left to say is that the arrows wrap.
const commandOptions = { loop: true }

const route = useRoute()
const router = useRouter()

const query = ref('')
const input = useTemplateRef<HTMLInputElement>('input')

const { isActive, close } = useMagicCommand(commandId)

// The index is built by Nuxt Content itself, so there is no second search
// dependency and no separate crawl to keep in step with the content.
const { data: sections, execute } = await useAsyncData(
  'docs-search-sections',
  () => queryCollectionSearchSections('docs'),
  { immediate: false, default: () => [] }
)

const results = computed<Array<SearchResult>>(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) {
    return []
  }

  const scored: Array<Omit<SearchResult, 'index'>> = []

  for (const section of sections.value ?? []) {
    const titles = section.titles ?? []
    const title = section.title ?? ''
    const haystack = `${titles.join(' ')} ${title}`.toLowerCase()
    const body = (section.content ?? '').toLowerCase()

    // An exact title hit outranks a prefix, which outranks a contains, which
    // outranks a body hit, so searching `magicmenu` lands on the MagicMenu page
    // rather than on its Installation section. A word of a camel-cased title
    // counts as exact, so `drawer` ties MagicDrawer with MagicCommand’s Drawer
    // example, and the page wins the tie.
    const words = title
      .split(/(?<=[a-z])(?=[A-Z])|\s+/)
      .map((word) => word.toLowerCase())
    let score = 0
    if (title.toLowerCase() === term || words.includes(term)) {
      score = 4
    } else if (haystack.startsWith(term)) {
      score = 3
    } else if (haystack.includes(term)) {
      score = 2
    } else if (body.includes(term)) {
      score = 1
    }
    if (!score) {
      continue
    }

    const path = section.id.split('#')[0] ?? section.id

    scored.push({
      id: section.id,
      title: title || titles.at(-1) || 'Untitled',
      // Inside a group the page name is already printed, so a row adds the
      // headings between it and the page, and the page's own row adds its path.
      detail: section.id === path ? path : titles.slice(1).join(' › '),
      score,
      depth: titles.length,
      path,
    })
  }

  // Equal scores break towards the shallower section, which is the one a
  // reader is more likely to have meant.
  return scored
    .sort((a, b) => b.score - a.score || a.depth - b.depth)
    .slice(0, 20)
    .map((result, index) => ({ ...result, index }))
})

/**
 * The list stays one flat run of items, so the arrows keep moving straight
 * down whatever page a row belongs to. The grouping is only how it is drawn,
 * and a page holds the position its best hit earned it.
 */
const groups = computed(() => {
  const byPath = new Map<
    string,
    { path: string; title: string; results: Array<SearchResult> }
  >()

  for (const result of results.value) {
    const group = byPath.get(result.path)
    if (group) {
      group.results.push(result)
      continue
    }
    byPath.set(result.path, {
      path: result.path,
      title: pageTitle(result),
      results: [result],
    })
  }

  return [...byPath.values()]
})

// A page's own section is indexed under the page's path and carries its title.
function pageTitle(result: SearchResult) {
  const page = (sections.value ?? []).find(
    (section) => section.id === result.path
  )
  return page?.title || result.path
}

function go(result: SearchResult) {
  close()
  router.push(result.id)
}

// The sections are fetched the first time the palette opens, and the query is
// dropped on the way out so the next ⌘K starts from an empty field.
watch(isActive, (value) => {
  if (value) {
    execute()
    return
  }
  query.value = ''
  // The trigger merges itself onto the button rather than rendering one, so
  // the way back to it is the id it stamped there.
  document.querySelector<HTMLElement>(`[data-id="${viewId}-trigger"]`)?.focus()
})

// The field arrives with the palette, one teleport later, so the focus follows
// the element rather than the open state.
watch(input, (element) => {
  element?.focus()
})

// Following a link is the one way out that the palette itself does not know
// about.
watch(
  () => route.fullPath,
  () => {
    if (isActive.value) {
      close()
    }
  }
)
</script>
