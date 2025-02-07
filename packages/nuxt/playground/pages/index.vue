<template>
  <ol>
    <li v-for="composable in composables" :key="composable.name">
      <nuxt-link :to="`/${kebabCase(composable.name)}`">
        {{ composable.name }}
      </nuxt-link>
    </li>
    <li
      v-for="plugin in plugins.filter(
        (plugin) => plugin.name !== 'MagicEmitter'
      )"
      :key="plugin.name"
    >
      <nuxt-link :to="`/${kebabCase(plugin.name)}`">
        {{ plugin.name }}
      </nuxt-link>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { kebabCase } from 'scule'
import { composables, plugins } from '../../../metadata'
</script>
