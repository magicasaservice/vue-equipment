<template>
  <m-menu-card>
    <template v-if="!!data.icon" #start>
      <m-menu-card-child start>
        <m-avatar variant="secondary" size="xs" mode="outline">
          <i-maas-maas-ve-500 class="h-4 w-4" v-if="data.icon === 'maas-ve'" />
          <i-maas-maas-mr-500 class="h-4 w-4" v-if="data.icon === 'maas-mr'" />
          <i-maas-maas-dt-500 class="h-4 w-4" v-if="data.icon === 'maas-dt'" />
          <i-maas-maas-az-500 class="h-4 w-4" v-if="data.icon === 'maas-az'" />
          <i-maas-maas-of-500 class="h-4 w-4" v-if="data.icon === 'maas-of'" />
          <i-maas-edit-alt-500
            class="h-4 w-4"
            v-if="data.icon === 'edit-alt'"
          />
          <i-maas-maas-robot-500
            class="h-4 w-4"
            v-if="data.icon === 'maas-robot'"
          />
          <i-maas-brand-github-500
            class="h-4 w-4"
            v-if="data.icon === 'brand-github'"
          />
          <i-maas-brand-figma-500
            class="h-4 w-4"
            v-if="data.icon === 'brand-figma'"
          />
          <i-maas-brand-vue-500
            class="h-4 w-4"
            v-if="data.icon === 'brand-vue'"
          />
          <i-maas-brand-nuxt-500
            class="h-4 w-4"
            v-if="data.icon === 'brand-nuxt'"
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
