<template>
  <vue-primitive
    class="magic-tray-trigger"
    :as-child="asChild"
    :data-id="`${mappedId}-trigger`"
    :data-side="side"
    :data-dragging="active"
    :data-dragged="hasDragged"
    :data-disabled="mappedDisabled"
    @pointerdown="guardedPointerdown"
    @touchstart="guardedTouchstart"
  >
    <slot :dragging="active" :disabled="mappedDisabled" />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { computed, inject, toValue } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useTrayState } from '../composables/private/useTrayState'
import { useTrayGesture } from '../composables/private/useTrayGesture'
import { MagicTrayInstanceId } from '../symbols'

import type { MaybeRef } from 'vue'
import type { UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'

import type { MagicTraySide } from '../types/index'

interface MagicTrayTriggerProps {
  id?: MaybeRef<string>
  side: MagicTraySide
  disabled?: boolean
  preventEdgeNavigation?: boolean
  asChild?: boolean
}

const { id, side, disabled, preventEdgeNavigation, asChild } =
  defineProps<MagicTrayTriggerProps>()

const injectedInstanceId = inject(MagicTrayInstanceId, undefined)

const mappedInstanceId = computed(() => id ?? injectedInstanceId)

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicTray',
  source: 'MagicTrayTrigger',
})

magicError.assert(mappedInstanceId.value, {
  message:
    'MagicTrayTrigger must be nested inside MagicTrayProvider or an id must be provided',
  errorCode: 'missing_instance_id',
})

const mappedId = computed(() => toValue(mappedInstanceId.value ?? ''))

const { initializeState } = useTrayState(mappedId)
const state = initializeState()

const { active, hasDragged, onPointerdown, onTouchstart } = useTrayGesture({
  id: mappedId,
  state,
  selectionLock: 'drag',
  preventEdgeNavigation: () =>
    preventEdgeNavigation ?? state.options.preventEdgeNavigation,
})

const mappedDisabled = computed(() => disabled || state.options.disabled)

// Form fields and editable text keep their presses, so typing and selecting
// text inside a trigger still work
function isEditable(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  return (
    target.closest('input, textarea, select') !== null ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

function canDrag(event: Event) {
  return !mappedDisabled.value && !isEditable(event.target)
}

function guardedPointerdown(event: PointerEvent) {
  if (canDrag(event)) {
    onPointerdown(side, event)
  }
}

function guardedTouchstart(event: TouchEvent) {
  if (canDrag(event)) {
    onTouchstart(side, event)
  }
}
</script>

<style>
.magic-tray-trigger[data-disabled='false'][data-side='left'],
.magic-tray-trigger[data-disabled='false'][data-side='right'] {
  touch-action: var(--magic-tray-trigger-touch-action, pan-y);
}

.magic-tray-trigger[data-disabled='false'][data-side='top'],
.magic-tray-trigger[data-disabled='false'][data-side='bottom'] {
  touch-action: var(--magic-tray-trigger-touch-action, pan-x);
}

.magic-tray-trigger[data-dragging='true'] * {
  -webkit-user-drag: none;
}

.magic-tray-trigger[data-dragged='true'] * {
  pointer-events: none;
}
</style>
