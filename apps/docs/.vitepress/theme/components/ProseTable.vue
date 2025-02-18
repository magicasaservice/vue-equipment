<template>
  <div
    class="prose-table border-surface my-5 w-full border-collapse overflow-auto rounded-lg border"
  >
    <table class="!table w-full !overflow-hidden">
      <thead>
        <tr>
          <th
            v-for="{ label } in columns"
            :key="label"
            v-html="parseMarkdown(label)"
          />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in mappedRows" :key="i">
          <td
            v-for="(cell, j) in row.items"
            :key="j"
            class="truncate text-[var(--vp-code-color)]"
          >
            <magic-menu-provider
              v-if="cell.description"
              id="magic-menu--dropdown"
              :options="{ mode: 'dropdown', scrollLock: false }"
            >
              <magic-menu-view
                :id="useId()"
                class="flex items-center gap-2"
                placement="top"
              >
                <span
                  v-if="cell.plaintext"
                  class="truncate"
                  v-html="cell.parsedLabel"
                />
                <code v-else class="truncate" v-html="cell.parsedLabel" />
                <magic-menu-trigger as-child>
                  <m-button size="xs" square mode="plain">
                    <i-maas-sign-info-oval-500 class="text-surface-subtle" />
                  </m-button>
                </magic-menu-trigger>
                <magic-menu-content :arrow="false" class="vp-doc">
                  <div
                    class="bg-surface-elevation-high type-surface-body-sm max-w-xs rounded-md px-2 py-2"
                  >
                    <span v-html="cell.parsedDescription" />
                  </div>
                </magic-menu-content>
              </magic-menu-view>
            </magic-menu-provider>
            <span v-else-if="cell.plaintext" v-html="cell.parsedLabel" />
            <code v-else v-html="cell.parsedLabel" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useId, computed } from 'vue'
import { MButton } from '@maas/mirror/vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

interface Item {
  label: string
  description?: string
  plaintext?: boolean
  escape?: boolean
}

interface Row {
  items: Item[]
}

interface Column {
  label: string
}

interface ProseTableProps {
  columns: Column[]
  rows: Row[]
}

const { columns, rows } = defineProps<ProseTableProps>()

function parseMarkdown(content: string) {
  if (!content) return ''
  return md.renderInline(content)
}

const mappedRows = computed(() => {
  return rows.map((row) => ({
    items: row.items.map((item) => {
      const parsed = {
        ...item,
        parsedLabel: item.escape
          ? escapeBrackets(item.label)
          : parseMarkdown(item.label),
        parsedDescription: item.description
          ? parseMarkdown(item.description)
          : undefined,
      }
      return parsed
    }),
  }))
})

function escapeBrackets(string: string) {
  return string.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>
