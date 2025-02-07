<template>
  <magic-accordion-provider id="magic-accordion-demo" class="w-full">
    <demo-list
      v-for="item in footer"
      :key="item.label"
      :headline="item.label"
      :list="<DemoListProps['list']>item.list"
    />
  </magic-accordion-provider>
</template>

<script lang="ts" setup>
import DemoList, { type DemoListProps } from './components/DemoList.vue'
import { footer } from './data/footer.json'
</script>
