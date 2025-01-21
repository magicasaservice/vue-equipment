<template>
  <magic-accordion-provider id="magic-accordion-demo" class="w-full">
    <magic-accordion-view>
      <magic-accordion-trigger>Card Tricks</magic-accordion-trigger>
      <magic-accordion-content>
        <div class="w-[20rem]">
          Card tricks captivate audiences with sleight of hand, misdirection,
          and clever psychology, creating illusions that make the impossible
          seem real.
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
    <magic-accordion-view>
      <magic-accordion-trigger>Illusions</magic-accordion-trigger>
      <magic-accordion-content>
        <div class="w-[20rem]">
          Illusions in magic rely on optical tricks and hidden mechanisms,
          making spectators question reality and marvel at the magician’s
          seemingly supernatural skills.
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
    <magic-accordion-view>
      <magic-accordion-trigger>Escapes</magic-accordion-trigger>
      <magic-accordion-content>
        <div class="w-[20rem]">
          Escape artists perform daring feats of escape from handcuffs, chains,
          and other restraints, thrilling audiences with their death-defying
          stunts.
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
  </magic-accordion-provider>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>
