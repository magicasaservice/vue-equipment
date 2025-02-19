<template>
  <magic-menu-remote
    as-child
    :channel-id="kebabCase(channel.text)"
    :trigger="['click']"
  >
    <m-menu-item>
      <m-menu-item-child>
        <span class="truncate">{{ channel.text }}</span>
      </m-menu-item-child>
    </m-menu-item>
  </magic-menu-remote>
</template>

<script lang="ts" setup>
import { kebabCase } from 'scule'

interface NavDrawerMenuRemoteProps {
  channel: {
    text: string
    items: {
      text: string
      link: string
    }[]
  }
}

defineProps<NavDrawerMenuRemoteProps>()
</script>
