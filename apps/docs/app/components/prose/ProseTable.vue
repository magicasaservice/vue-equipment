<template>
  <docs-table v-if="parsed" :columns="parsed.columns" :rows="parsed.rows" />
  <div
    v-else
    class="docs-table bg-surface-high rounded-component-sm mt-6 mb-6 w-full overflow-x-auto first:mt-0"
  >
    <table class="w-full text-left">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { isVNode } from 'vue'
import type { VNode } from 'vue'

import type { DocsTableRow } from '../content/DocsTable.vue'

/**
 * Whatever markdown tables are left render through the same component as the
 * ones written as `docs-table` front matter, so both read as one table with
 * one set of manners. The markup Nuxt Content hands over is a fixed shape —
 * `thead > tr > th`, `tbody > tr > td` — so the cells are read off the slot
 * rather than off the DOM afterwards, and the table is a table on the server
 * too.
 */
const slots = useSlots()

// The last column of a reference table is prose. It is not a column here: it
// becomes the description on the cell that names the row, so a reader
// scanning for a name does not have to read past a sentence for every one.
const proseHeadings = new Set([
  'Description',
  'What it does',
  'What it holds',
  'Present when',
  'Thrown when',
  'Fires',
])

/** The children of a vnode, whether they are inline or a default slot. */
function childrenOf(node: VNode): Array<VNode> {
  const children = node.children
  if (Array.isArray(children)) {
    return children.filter(isVNode)
  }
  if (children && typeof children === 'object') {
    const slot = (children as Record<string, unknown>).default
    if (typeof slot === 'function') {
      return (slot() as Array<unknown>).filter(isVNode)
    }
  }
  return []
}

/** A cell's text. A markdown cell is prose here, so its markup is not kept. */
function textOf(node: VNode | undefined): string {
  if (!node) {
    return ''
  }
  if (typeof node.children === 'string') {
    return node.children
  }
  return childrenOf(node)
    .map((child) => textOf(child))
    .join('')
}

function parse() {
  const nodes = (slots.default?.() ?? []).filter(isVNode)
  const [head, body] = nodes
  if (!head || !body) {
    return undefined
  }

  const headRow = childrenOf(head)[0]
  const headings = (headRow ? childrenOf(headRow) : [])
    .map((cell) => textOf(cell).trim())
    .filter((heading) => heading)

  const bodyRows = childrenOf(body)
  if (!headings.length || !bodyRows.length) {
    return undefined
  }

  const detail = proseHeadings.has(headings[headings.length - 1]!)
  const columns = (detail ? headings.slice(0, -1) : headings).map((label) => ({
    label,
  }))

  const rows: Array<DocsTableRow> = bodyRows.map((row) => {
    const cells = childrenOf(row)
    const description = detail ? textOf(cells[columns.length]).trim() : ''
    return {
      items: columns.map((_column, cell) => ({
        label: textOf(cells[cell]).trim(),
        plaintext: true,
        description: cell === 0 && description ? description : undefined,
      })),
    }
  })

  return { columns, rows }
}

// Read on the first render, and cached: the markdown behind a table never
// changes while the page is mounted, and a different page mounts a different
// table. Slots may only be invoked while rendering, hence the computed.
const parsed = computed(() => parse())
</script>
