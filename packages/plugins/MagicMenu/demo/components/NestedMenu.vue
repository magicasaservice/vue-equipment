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
          <span>{{ item.cmd }}</span>
        </m-menu-item-child>
      </template>
    </m-menu-item>
  </magic-menu-item>
  <magic-menu-item v-else v-slot="{ itemActive }">
    <magic-menu-view v-slot="{ viewActive }">
      <magic-menu-trigger as-child>
        <m-menu-item size="xs" :active="itemActive ?? viewActive">
          <m-menu-item-child>{{ item.label }}</m-menu-item-child>
          <template v-if="item.cmd" #end>
            <m-menu-item-child end>
              <span>{{ item.cmd }}</span>
            </m-menu-item-child>
          </template>
        </m-menu-item>
      </magic-menu-trigger>
      <magic-menu-content :middleware="offsetMiddleware">
        <div class="bg-surface-elevation-high p-1 rounded-2xl w-[220px]">
          <nested-menu
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
import NestedMenu from '../components/NestedMenu.vue'

import { MMenuItem, MMenuItemChild } from '@maas/mirror/vue'
import { offset } from '@floating-ui/dom'

interface RecursiveMenuItemProps {
  item: {
    label: string
    cmd?: string
    items?: RecursiveMenuItemProps['item'][]
    disabled?: boolean
  }
}

defineProps<RecursiveMenuItemProps>()

const offsetMiddleware = [offset({ crossAxis: -4, mainAxis: 8 })]
</script>
