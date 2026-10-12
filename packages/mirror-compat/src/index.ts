/**
 * Mirror v2 ships headless parts only, so Mirror v1’s styled `M*` components
 * are rebuilt here: a v2 part inside, v2’s generated utility classes outside,
 * the v1 prop API on top.
 *
 * The demos import from here, and the docs app registers the whole barrel
 * globally so the `<m-*>` tags in its theme keep resolving.
 */
export { default as MAvatar } from './components/Avatar.vue'
export { default as MBadge } from './components/Badge.vue'
export { default as MButton } from './components/Button.vue'
export { default as MCheckbox } from './components/Checkbox.vue'
export { default as MInput } from './components/Input.vue'
export { default as MMenuBox } from './components/MenuBox.vue'
export { default as MMenuCard } from './components/MenuCard.vue'
export { default as MMenuCardChild } from './components/MenuCardChild.vue'
export { default as MMenuItem } from './components/MenuItem.vue'
export { default as MMenuItemChild } from './components/MenuItemChild.vue'
export { default as MSelect } from './components/Select.vue'
export { default as MSlider } from './components/Slider.vue'
export { default as MTextarea } from './components/Textarea.vue'
export { default as MToggle } from './components/Toggle.vue'

export type * from './types/avatar'
export type * from './types/badge'
export type * from './types/button'
export type * from './types/checkbox'
export type * from './types/input'
export type * from './types/menu-box'
export type * from './types/menu-card'
export type * from './types/menu-item'
export type * from './types/select'
export type * from './types/slider'
export type * from './types/textarea'
export type * from './types/toggle'
