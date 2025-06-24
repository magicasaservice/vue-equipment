<template>
  <magic-menu-item
    v-if="!item.items"
    v-slot="{ itemActive }"
    :disabled="item.disabled"
  >
    <m-menu-item :active="itemActive" :disabled="item.disabled" size="xs">
      <m-menu-item-child>{{ item.label }}</m-menu-item-child>
      <template v-if="item.cmd" #end>
        <m-menu-item-child end>
          <div class="pr-0.5">{{ item.cmd }}</div>
        </m-menu-item-child>
      </template>
    </m-menu-item>
  </magic-menu-item>
  <magic-menu-item v-else v-slot="{ itemActive }">
    <magic-menu-view v-slot="{ viewActive }">
      <magic-menu-trigger as-child>
        <m-menu-item size="xs" :active="itemActive ?? viewActive">
          <m-menu-item-child>{{ item.label }}</m-menu-item-child>
          <template #end>
            <m-menu-item-child end>
              <span v-if="item.cmd">{{ item.cmd }}</span>
              <i-maas-chevron-e-500 />
            </m-menu-item-child>
          </template>
        </m-menu-item>
      </magic-menu-trigger>
      <magic-menu-content :middleware="offsetMiddleware">
        <div class="bg-surface-elevation-high w-[220px] rounded-2xl p-1">
          <nested-demo-menu
            v-for="(subItem, index) in item.items"
            :key="index"
            :item="subItem"
          />
        </div>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-item>
</template>

<script lang="ts" setup>
import { MMenuItem, MMenuItemChild } from '@maas/mirror/vue'
import { offset } from '@floating-ui/dom'
import NestedDemoMenu from '../components/NestedDemoMenu.vue'

interface NestedDemoMenuProps {
  item: {
    label: string
    cmd?: string
    items?: NestedDemoMenuProps['item'][]
    disabled?: boolean
  }
}

defineProps<NestedDemoMenuProps>()

const offsetMiddleware = [offset({ crossAxis: -4, mainAxis: 8 })]
</script>
