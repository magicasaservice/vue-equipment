<template>
  <m-menu-card>
    <template v-if="!!data.icon" #start>
      <m-menu-card-child start>
        <m-avatar variant="secondary" size="xs" mode="outline">
          <i-maas-maas-ve-500 v-if="data.icon === 'maas-ve'" class="h-4 w-4" />
          <i-maas-maas-mr-500 v-if="data.icon === 'maas-mr'" class="h-4 w-4" />
          <i-maas-maas-dt-500 v-if="data.icon === 'maas-dt'" class="h-4 w-4" />
          <i-maas-maas-az-500 v-if="data.icon === 'maas-az'" class="h-4 w-4" />
          <i-maas-maas-of-500 v-if="data.icon === 'maas-of'" class="h-4 w-4" />
          <i-maas-edit-alt-500
            v-if="data.icon === 'edit-alt'"
            class="h-4 w-4"
          />
          <i-maas-maas-robot-500
            v-if="data.icon === 'maas-robot'"
            class="h-4 w-4"
          />
          <i-maas-brand-github-500
            v-if="data.icon === 'brand-github'"
            class="h-4 w-4"
          />
          <i-maas-brand-figma-500
            v-if="data.icon === 'brand-figma'"
            class="h-4 w-4"
          />
          <i-maas-brand-vue-500
            v-if="data.icon === 'brand-vue'"
            class="h-4 w-4"
          />
          <i-maas-brand-nuxt-500
            v-if="data.icon === 'brand-nuxt'"
            class="h-4 w-4"
          />
        </m-avatar>
      </m-menu-card-child>
    </template>
    <m-menu-card-child>
      <span>
        <div class="flex w-full items-center gap-2">
          <span class="truncate">{{ data.label }}</span>
          <m-badge v-if="data.badge" size="xs" mode="outline">
            {{ data.badge }}
          </m-badge>
        </div>
      </span>
      <span class="truncate">{{ data.callout }}</span>
    </m-menu-card-child>
  </m-menu-card>
</template>

<script lang="ts" setup>
import { MMenuCard, MMenuCardChild, MBadge, MAvatar } from '@maas/mirror/vue'

interface MenuCardInternalProps {
  data: {
    icon?: string
    label: string
    badge?: string
    callout: string
  }
}

defineProps<MenuCardInternalProps>()
</script>
