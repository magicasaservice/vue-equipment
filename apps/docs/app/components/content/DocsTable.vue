<template>
  <!-- One menu per table. Every description on it is a view of that one menu,
       so opening a second closes the first, and a single key listener serves
       the whole table however many rows it has. -->
  <magic-menu-provider
    :id="menuId"
    :options="{ mode: 'dropdown', scrollLock: false }"
    as-child
  >
    <!-- The table scrolls inside its own frame, so a long type union never
         widens the page. The block stays off the layout path until it is near
         the viewport; the longest plugin pages render several hundred rows. -->
    <div
      class="docs-table docs-reference-table rounded-component-sm border-surface mt-6 mb-6 w-full overflow-x-auto border-2 first:mt-0"
      :style="{ '--rows': rows.length }"
    >
      <table class="w-full text-left">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.label"
              scope="col"
              class="type-surface-body-sm -strong text-surface bg-surface-high border-surface border-b-2 border-l-2 px-4 py-2 whitespace-nowrap first:border-l-0"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in parsedRows" :key="index">
            <td
              v-for="(item, cell) in row.items"
              :key="cell"
              class="border-surface border-l-2 px-4 py-2.5 align-top first:border-l-0"
              :data-label="cell > 0 ? columns[cell]?.label : undefined"
            >
              <magic-menu-view
                v-if="item.description"
                :id="item.id"
                class="flex items-start gap-1"
                placement="top"
              >
                <docs-table-label :item="item" />
                <magic-menu-trigger v-slot="{ viewActive }" as-child>
                  <button
                    type="button"
                    class="docs-table-info rounded-component-compact-sm text-surface-subtle hover:text-surface hover:bg-surface-higher relative flex size-5 shrink-0 items-center justify-center transition-colors"
                    :aria-expanded="viewActive === true"
                    :aria-controls="`${item.id}-description`"
                    :aria-label="`Show the description of ${item.text}`"
                  >
                    <base-icon
                      name="sign-info-oval"
                      aria-hidden="true"
                      class="size-3.5"
                    />
                  </button>
                </magic-menu-trigger>
                <magic-menu-content :arrow="false">
                  <div
                    :id="`${item.id}-description`"
                    class="docs-table-panel type-surface-body-sm text-surface bg-surface-higher rounded-component-sm shadow-component-high max-w-xs px-3 py-2"
                    v-html="item.description"
                  />
                </magic-menu-content>
              </magic-menu-view>
              <docs-table-label v-else :item="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </magic-menu-provider>
</template>

<script setup lang="ts">
import { h } from 'vue'

/**
 * The one table on the site. Every reference table renders through it: the
 * ones generated from front matter, the ones an author writes as MDC front
 * matter, and whatever markdown tables are left.
 *
 * A cell is a label, set in Index unless it says it is prose, plus an optional
 * description. The description is not a column: it sits behind a small button
 * beside the label, so a page with two dozen props reads as a list of names
 * rather than as a wall of sentences.
 */
export interface DocsTableColumn {
  label: string
}

export interface DocsTableItem {
  /** Inline markdown: `code`, links, emphasis. */
  label: string
  /** Inline markdown, shown in a popover beside the label. */
  description?: string
  /** Prose rather than a name: body type, muted, no code face. */
  plaintext?: boolean
  /** Take the label as written: escape it, and read no markdown in it. */
  escape?: boolean
}

export interface DocsTableRow {
  items: Array<DocsTableItem>
}

const { rows } = defineProps<{
  columns: Array<DocsTableColumn>
  rows: Array<DocsTableRow>
}>()

const menuId = `docs-table-${useId()}`

/** A cell's label. Its markup is already HTML, so it is set rather than slotted. */
const DocsTableLabel = (props: { item: ParsedItem }) =>
  h(props.item.tag, {
    class: props.item.class,
    innerHTML: props.item.label,
  })

interface ParsedItem {
  id: string
  tag: 'code' | 'span'
  class: string
  label: string
  text: string
  description: string | undefined
}

const parsedRows = computed<Array<{ items: Array<ParsedItem> }>>(() =>
  rows.map((row, index) => ({
    items: row.items.map((item, cell) => ({
      id: `${menuId}-${index}-${cell}`,
      tag: item.plaintext ? ('span' as const) : ('code' as const),
      class: item.plaintext
        ? 'docs-body-sm text-surface-muted'
        : 'docs-code text-surface whitespace-nowrap',
      label: item.escape
        ? escapeHtml(item.label)
        : renderInlineMarkdown(item.label),
      text: plainMarkdown(item.label),
      description: item.description
        ? renderInlineMarkdown(item.description)
        : undefined,
    })),
  }))
)
</script>

<style scoped>
/* MagicMenuProvider paints `user-select: none` on whatever it wraps, and the
   names in this table are there to be copied. */
.docs-table {
  user-select: text;
}

.docs-table tbody tr + tr {
  border-block-start: 2px solid var(--app-color-surface-border);
}

/* Code nested inside a cell that is already code, and code inside a
   description, keep the face and drop the fill: the ground underneath is
   already a panel, so a second fill on top of it reads as a smudge rather
   than as a distinction. */
.docs-table :deep(.docs-code .docs-inline-code),
.docs-table-panel :deep(.docs-inline-code) {
  background-color: transparent;
  padding-inline: 0;
}

/* 20px is the right optical size beside 13px code. A finger needs 44, so the
   target grows around the mark rather than moving it. */
@media (pointer: coarse) {
  .docs-table-info::after {
    content: '';
    position: absolute;
    inset: -0.75rem;
  }
}

/* Narrow: the same rows as stacked fields, because a four-column table with a
   type union in it cannot wrap. Each cell carries its own column heading,
   since there is no header row left to read it from. */
@media (width < 40rem) {
  .docs-table {
    overflow-x: visible;
  }

  .docs-table thead {
    display: none;
  }

  .docs-table table,
  .docs-table tbody,
  .docs-table tr,
  .docs-table td {
    display: block;
  }

  .docs-table tr {
    padding: 0.75rem 1rem;
  }

  .docs-table td {
    padding: 0;
    border-inline-start: 0;
  }

  .docs-table td[data-label] {
    margin-top: 0.25rem;
  }

  .docs-table td[data-label]::before {
    content: attr(data-label);
    display: block;
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: var(--app-color-surface-fg-muted);
  }
}
</style>
