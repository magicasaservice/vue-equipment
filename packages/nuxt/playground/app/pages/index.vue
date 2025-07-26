<template>
  <ol>
    <li v-for="composable in composables" :key="composable.name">
      <nuxt-link :to="`/composables/${kebabCase(composable.name)}`">
        {{ composable.name }}
      </nuxt-link>
    </li>
    <li v-for="plugin in mappedPlugins" :key="plugin.name">
      <nuxt-link :to="`/plugins/${kebabCase(plugin.name)}`">
        {{ plugin.name }}
      </nuxt-link>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { kebabCase } from 'scule'
import {
  composables,
  plugins,
  type VueEquipmentFunction,
} from '../../../metadata'

const mappedPlugins = plugins.filter(
  (plugin: VueEquipmentFunction) => plugin.name !== 'MagicEmitter'
)
</script>
