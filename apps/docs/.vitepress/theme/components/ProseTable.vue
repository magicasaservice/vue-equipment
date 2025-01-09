<template>
  <table tabindex="0">
    <thead>
      <tr>
        <th v-for="{ label } in columns" :key="label">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="i">
        <td v-for="(cell, j) in row" :key="j">
          <code v-html="cell.label" v-if="cell.code && !cell.description" />
          <span v-html="cell.label" v-else />
          <br v-if="cell.description" />
          <span v-if="cell.description">
            <code v-html="cell.description" v-if="cell.code" />
            <span v-else v-html="cell.description" />
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Item {
  label: string
  description?: string
  code?: boolean
}

interface Column {
  label: string
  items: Item[]
}
interface OptionsTableProps {
  columns: Column[]
}

const { columns } = defineProps<OptionsTableProps>()

const rows = computed(() => {
  const maxRows = Math.max(...columns.map((col) => col.items.length))

  return Array.from({ length: maxRows }, (_, rowIndex) =>
    columns.map((column) => column.items[rowIndex] || undefined)
  ).filter((row) => !!row)
})
</script>
