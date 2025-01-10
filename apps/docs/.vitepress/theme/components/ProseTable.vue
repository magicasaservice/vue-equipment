<template>
  <table class="w-full table-fixed !table">
    <thead class="w-full">
      <tr>
        <th v-for="{ label } in columns" :key="label">{{ label }}</th>
      </tr>
    </thead>
    <tbody class="w-full">
      <tr v-for="(row, i) in mappedRows" :key="i">
        <td v-for="(cell, j) in row.items" :key="j">
          <magic-menu-provider
            v-if="cell.description"
            id="magic-menu--dropdown"
            :options="{ mode: 'dropdown' }"
          >
            <magic-menu-view
              class="flex gap-2 items-center"
              :id="useId()"
              placement="top"
            >
              <code
                v-if="cell.code?.includes('label')"
                v-html="cell.label"
                class="truncate"
              />
              <span v-html="cell.label" v-else class="truncate" />
              <magic-menu-trigger as-child>
                <m-button size="xs" square mode="plain">
                  <i-maas-sign-info-oval-500 class="text-surface-subtle" />
                </m-button>
              </magic-menu-trigger>
              <magic-menu-content :arrow="false" class="vp-doc">
                <div
                  class="bg-surface-elevation-high border-2 border-surface rounded-md px-2 py-2 max-w-xs type-surface-body-sm"
                >
                  <code size="xs" v-if="cell.code?.includes('description')">
                    <span v-html="cell.description" />
                  </code>
                  <span v-else v-html="cell.description" />
                </div>
              </magic-menu-content>
            </magic-menu-view>
          </magic-menu-provider>
          <code v-else-if="cell.code?.includes('label')" v-html="cell.label" />
          <span v-html="cell.label" v-else />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { useId, computed } from 'vue'
import { MButton } from '@maas/mirror/vue'

interface Item {
  label: string
  description?: string
  code?: Array<'label' | 'description'>
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

// Escape any < or > characters in the label
const mappedRows = computed(() => {
  return rows.map((row) => ({
    items: row.items.map((item) => {
      if (item.escape) {
        return {
          ...item,
          label: escapeBrackets(item.label),
        }
      } else {
        return item
      }
    }),
  }))
})

function escapeBrackets(string: string) {
  return string.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>
