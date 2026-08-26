/**
 * Mirror v2 dropped the styled `M*` components. `mirror init --compat`
 * scaffolded these wrappers, which put the v1 prop matrix and the v1 class
 * names back on top of the v2 headless parts. They are ours to maintain from
 * here on, and Mirror will not update them.
 *
 * The demos import from here, and the docs app registers the whole barrel
 * globally so the `<m-*>` tags keep resolving.
 */

export { default as MAvatar } from './src/components/MAvatar.vue'
export { default as MBadge } from './src/components/MBadge.vue'
export { default as MButton } from './src/components/MButton.vue'
export { default as MCheckbox } from './src/components/MCheckbox.vue'
export { default as MInput } from './src/components/MInput.vue'
export { default as MMenuBox } from './src/components/MMenuBox.vue'
export { default as MMenuCard } from './src/components/MMenuCard.vue'
export { default as MMenuCardChild } from './src/components/MMenuCardChild.vue'
export { default as MMenuItem } from './src/components/MMenuItem.vue'
export { default as MMenuItemChild } from './src/components/MMenuItemChild.vue'
export { default as MMessage } from './src/components/MMessage.vue'
export { default as MSelect } from './src/components/MSelect.vue'
export { default as MSlider } from './src/components/MSlider.vue'
export { default as MTextarea } from './src/components/MTextarea.vue'
export { default as MToggle } from './src/components/MToggle.vue'
