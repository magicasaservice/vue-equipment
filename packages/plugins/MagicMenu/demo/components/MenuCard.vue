<template>
  <m-menu-card>
    <template v-if="!!data.icon" #start>
      <m-menu-card-child start>
        <m-avatar variant="secondary" size="xs" mode="outline">
          <!-- <ui-icon-renderer :name="data.icon" class="h-4 w-4" /> -->
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
    badge: string
    callout: string
  }
}

defineProps<MenuCardInternalProps>()
</script>
