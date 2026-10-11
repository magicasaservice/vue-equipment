<template>
  <MirrorAvatarRoot
    as="div"
    :class="classes"
    :data-image="image || undefined"
    :data-inline="inline || undefined"
    :data-mode="mode"
    :data-round="round || undefined"
    :data-size="size"
  >
    <slot>{{ initials }}</slot>
  </MirrorAvatarRoot>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AvatarRoot as MirrorAvatarRoot } from '@maas/mirror/vue/Avatar'
import {
  avatarBase,
  avatarColor,
  avatarImage,
  avatarInlineRadius,
  avatarInlineSize,
  avatarRadius,
  avatarRoundRadius,
  avatarSize,
} from '../styles/avatar'

import type { MAvatarProps } from '../types/avatar'

// Only the root of v2’s Avatar is used. `Avatar.Image` loads a `src` and
// `Avatar.Fallback` stands in until it has, and v1’s avatar takes neither: it
// takes arbitrary slot content and no source at all, so there is nothing to
// load and the fallback would only put an inline box between the flex root and
// the icon it centres. The root is rendered `as="div"`, which is the element
// v1 rendered, and carries the `user-select` v1 set.
const {
  size = 'md',
  mode = 'solid',
  initials = '',
  inline = false,
  image = false,
  round = false,
} = defineProps<MAvatarProps>()

// Exactly one class per CSS property reaches the element. Two utilities for
// the same property would be resolved by the order Tailwind emits them in
// rather than by the order they sit in this list, so the branches pick.
const classes = computed(() => {
  const out = [avatarBase]

  out.push(inline ? avatarInlineSize[size] : avatarSize[size])

  if (round) {
    out.push(avatarRoundRadius)
  } else {
    out.push(inline ? avatarInlineRadius[size] : avatarRadius[size])
  }

  out.push(image ? avatarImage : avatarColor[mode])

  return out
})
</script>

<style>
/*
 * The type ramp, the symbol ramp and the image fill, the three things v1’s
 * `avatar.css` set that no generated utility expresses. `type-component-*`
 * carries the text face at 140% leading and no tracking, and an avatar wants
 * the number face at 100% with the wide tracking, so the whole block reads the
 * application variables the utilities read.
 *
 * Unscoped, and rooted at `.m-avatar`, because slot content and the headless
 * root carry a different scope id than this component.
 *
 * v1 sized an inline avatar’s icon from `--avatar-dimension-iconinline-md`,
 * which is not a token any build emitted, so the height of a medium inline
 * icon fell back to the default ramp. It is implemented as intended here.
 */
.m-avatar {
  --m-avatar-font-size: var(--app-font-size-text-xl);
  --m-avatar-symbol: calc(var(--spacing) * 6);

  font-family: var(--app-font-family-number);
  font-size: var(--m-avatar-font-size);
  font-weight: var(--app-font-weight-text-strong);
  letter-spacing: var(--app-letter-spacing-wide);
  line-height: var(--app-line-height-none);
  text-transform: var(--app-text-case);
}

.m-avatar[data-size='xs'] {
  --m-avatar-font-size: var(--app-font-size-text-xs);
  --m-avatar-symbol: calc(var(--spacing) * 4.5);
}

.m-avatar[data-size='sm'] {
  --m-avatar-font-size: var(--app-font-size-text-md);
  --m-avatar-symbol: calc(var(--spacing) * 5.25);
}

.m-avatar[data-size='md'] {
  --m-avatar-font-size: var(--app-font-size-text-xl);
  --m-avatar-symbol: calc(var(--spacing) * 6);
}

.m-avatar[data-size='lg'] {
  --m-avatar-font-size: var(--app-font-size-text-3xl);
  --m-avatar-symbol: calc(var(--spacing) * 6.75);
}

.m-avatar[data-size='xl'] {
  --m-avatar-font-size: var(--app-font-size-text-5xl);
  --m-avatar-symbol: calc(var(--spacing) * 7.5);
}

.m-avatar[data-inline='true'][data-size='xs'] {
  --m-avatar-font-size: var(--app-font-size-text-3xs);
  --m-avatar-symbol: calc(var(--spacing) * 3.5);
}

.m-avatar[data-inline='true'][data-size='sm'] {
  --m-avatar-font-size: var(--app-font-size-text-xs);
  --m-avatar-symbol: calc(var(--spacing) * 4.25);
}

.m-avatar[data-inline='true'][data-size='md'] {
  --m-avatar-font-size: var(--app-font-size-text-md);
  --m-avatar-symbol: calc(var(--spacing) * 5);
}

.m-avatar[data-inline='true'][data-size='lg'] {
  --m-avatar-font-size: var(--app-font-size-text-lg);
  --m-avatar-symbol: calc(var(--spacing) * 5.75);
}

.m-avatar[data-inline='true'][data-size='xl'] {
  --m-avatar-font-size: var(--app-font-size-text-2xl);
  --m-avatar-symbol: calc(var(--spacing) * 6.5);
}

.m-avatar svg {
  inline-size: var(--m-avatar-symbol);
  block-size: var(--m-avatar-symbol);
}

.m-avatar img {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
</style>
