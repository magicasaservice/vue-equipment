<template>
  <label
    :aria-disabled="disabled"
    :class="classes"
    :data-disabled="disabled || undefined"
    :data-error="error || undefined"
    :data-mode="mode"
    :data-reverse="reverse || undefined"
    :data-size="size"
    :data-state="state"
  >
    <MirrorCheckboxRoot
      :id="id || undefined"
      v-model="checked"
      v-model:indeterminate="indeterminate"
      :aria-invalid="error || undefined"
      :class="boxClasses"
      :options="{ disabled: disabled || undefined, forceMount: true }"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <MirrorCheckboxIndicator class="m-checkbox__symbol" />
    </MirrorCheckboxRoot>
    <slot name="label">
      <span>{{ label }}</span>
    </slot>
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  CheckboxIndicator as MirrorCheckboxIndicator,
  CheckboxRoot as MirrorCheckboxRoot,
} from '@maas/mirror/vue/Checkbox'
import {
  checkboxBase,
  checkboxBoxBase,
  checkboxBoxCheckedColor,
  checkboxBoxCheckedDangerColor,
  checkboxBoxCheckedDisabledColor,
  checkboxBoxColor,
  checkboxBoxDangerColor,
  checkboxBoxDisabledColor,
  checkboxBoxSize,
  checkboxCursor,
  checkboxDirection,
  checkboxDisabledCursor,
  checkboxGap,
  checkboxLabelColor,
  checkboxLabelDangerColor,
  checkboxLabelDisabledColor,
  checkboxReverseDirection,
} from '../styles/checkbox'

import type { MCheckboxProps } from '../types/checkbox'

const {
  modelValue = false,
  id = '',
  label = 'Label',
  mode = 'solid',
  size = 'md',
  reverse = false,
  disabled = false,
  error = false,
} = defineProps<MCheckboxProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: MCheckboxProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

// v1 carried the mixed state inside `modelValue`; v2 splits it in two. The
// getters take it apart and the setters put it back together.
const checked = computed({
  get() {
    return modelValue === true
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// Activating a mixed checkbox clears the mixed state and then checks it, in
// that order, so the clearing half emits nothing and lets the `checked` setter
// answer for both. Only a move *into* the mixed state has to be reported.
const indeterminate = computed({
  get() {
    return modelValue === 'indeterminate'
  },
  set(value) {
    if (value) {
      emit('update:modelValue', 'indeterminate')
    }
  },
})

// v1 painted `:checked` and `:indeterminate` from the same tokens.
const painted = computed(() => modelValue !== false)

// v1’s check was an always-present `:after` that took a background and a mask
// only once the input was checked, so the indicator is force-mounted and the
// CSS shows it from this attribute. One prop paints the whole component.
const state = computed(() => {
  if (modelValue === 'indeterminate') {
    return 'indeterminate'
  }

  return modelValue ? 'checked' : 'unchecked'
})

// Exactly one utility per CSS property reaches an element, so the colour is a
// branch here rather than two classes racing in the stylesheet. Disabled
// replaces the error colour, which is what v1’s `.-error:not(.-disabled)` did.
const classes = computed(() => {
  const out = [checkboxBase, checkboxGap[size]]

  out.push(disabled ? checkboxDisabledCursor : checkboxCursor)
  out.push(reverse ? checkboxReverseDirection : checkboxDirection)

  if (disabled) {
    out.push(checkboxLabelDisabledColor[mode])
  } else if (error) {
    out.push(checkboxLabelDangerColor)
  } else {
    out.push(checkboxLabelColor[mode])
  }

  return out
})

const boxClasses = computed(() => {
  const out = [checkboxBoxBase, checkboxBoxSize[size]]

  if (disabled) {
    out.push(
      painted.value ? checkboxBoxCheckedDisabledColor : checkboxBoxDisabledColor
    )
  } else if (error) {
    out.push(
      painted.value ? checkboxBoxCheckedDangerColor : checkboxBoxDangerColor
    )
  } else {
    out.push(painted.value ? checkboxBoxCheckedColor : checkboxBoxColor)
  }

  return out
})

// v1 declared both events and never fired either. They fire now, with v1’s
// payload-free signature.
function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
}
</script>

<style>
/*
 * The port of v1’s `checkbox.css`. Component tokens become the application
 * variables they resolved to, the state classes become data attributes, and
 * the check itself stays the mask v1 painted, as a public custom property with
 * the asset as its literal.
 *
 * Unscoped, and every selector rooted at `.m-checkbox`, because the `label`
 * slot carries the parent’s scope id and the headless box carries its own.
 * Nothing here sets a property the class list sets.
 */
.m-checkbox {
  --m-checkbox-size: calc(var(--spacing) * 5);
  --m-checkbox-font-size: var(--app-font-size-text-xs);
  --m-checkbox-symbol-size: calc(var(--spacing) * 3.75);
  --m-checkbox-symbol: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2018%2018'%3E%3Cpath%20d='M13.6875%205.1875C13.875%205%2014.1042%204.90625%2014.375%204.90625C14.6458%204.90625%2014.875%205%2015.0625%205.1875C15.25%205.375%2015.3438%205.60417%2015.3438%205.875C15.3438%206.14583%2015.25%206.375%2015.0625%206.5625L7.96875%2013.6562C7.63542%2013.9896%207.22917%2014.1562%206.75%2014.1562C6.27083%2014.1562%205.86458%2013.9896%205.53125%2013.6562L2.9375%2011.0625C2.75%2010.875%202.65625%2010.6458%202.65625%2010.375C2.65625%2010.1042%202.75%209.875%202.9375%209.6875C3.125%209.5%203.35417%209.40625%203.625%209.40625C3.89583%209.40625%204.125%209.5%204.3125%209.6875L6.90625%2012.2812C6.86458%2012.2396%206.8125%2012.2188%206.75%2012.2188C6.6875%2012.2188%206.63542%2012.2396%206.59375%2012.2812L13.6875%205.1875Z'/%3E%3C/svg%3E");
  --m-checkbox-symbol-indeterminate: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2018%2018'%3E%3Cpath%20d='M14.0313%208.03125C14.3021%208.03125%2014.5312%208.125%2014.7187%208.3125C14.9062%208.5%2015%208.72917%2015%209C15%209.27083%2014.9062%209.5%2014.7187%209.6875C14.5312%209.875%2014.3021%209.96875%2014.0313%209.96875H3.96875C3.69792%209.96875%203.46875%209.875%203.28125%209.6875C3.09375%209.5%203%209.27083%203%209C3%208.72917%203.09375%208.5%203.28125%208.3125C3.46875%208.125%203.69792%208.03125%203.96875%208.03125H14.0313Z'/%3E%3C/svg%3E");
}

.m-checkbox[data-size='sm'] {
  --m-checkbox-size: calc(var(--spacing) * 4);
  --m-checkbox-font-size: var(--app-font-size-text-2xs);
  --m-checkbox-symbol-size: calc(var(--spacing) * 3);
  --m-checkbox-symbol: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2012%2012'%3E%3Cpath%20d='M9.0625%203.44792C9.19444%203.31597%209.35764%203.25%209.55208%203.25C9.74653%203.25%209.90972%203.31944%2010.0417%203.45833C10.1806%203.59028%2010.25%203.75347%2010.25%203.94792C10.25%204.14236%2010.184%204.30556%2010.0521%204.4375L5.35417%209.14583C5.11806%209.375%204.83333%209.48958%204.5%209.48958C4.16667%209.48958%203.88194%209.375%203.64583%209.14583L1.94792%207.4375C1.81597%207.30556%201.75%207.14236%201.75%206.94792C1.75%206.75347%201.81597%206.59028%201.94792%206.45833C2.08681%206.31944%202.25347%206.25%202.44792%206.25C2.64236%206.25%202.80556%206.31597%202.9375%206.44792L4.64583%208.14583C4.60417%208.11111%204.55556%208.09375%204.5%208.09375C4.44444%208.09375%204.39583%208.11111%204.35417%208.14583L9.0625%203.44792Z'/%3E%3C/svg%3E");
  --m-checkbox-symbol-indeterminate: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2012%2012'%3E%3Cpath%20d='M9.30208%205.30208C9.49653%205.30208%209.65972%205.37153%209.79167%205.51042C9.93056%205.64236%2010%205.80556%2010%206C10%206.19444%209.93056%206.36111%209.79167%206.5C9.65972%206.63194%209.49653%206.69792%209.30208%206.69792H2.69792C2.50347%206.69792%202.33681%206.63194%202.19792%206.5C2.06597%206.36111%202%206.19444%202%206C2%205.80556%202.06597%205.64236%202.19792%205.51042C2.33681%205.37153%202.50347%205.30208%202.69792%205.30208H9.30208Z'/%3E%3C/svg%3E");
}

.m-checkbox[data-size='lg'] {
  --m-checkbox-size: calc(var(--spacing) * 6);
  --m-checkbox-font-size: var(--app-font-size-text-sm);
  --m-checkbox-symbol-size: calc(var(--spacing) * 4.5);
  --m-checkbox-symbol: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='M18.5208%206.9375C18.7153%206.71528%2018.9722%206.60417%2019.2917%206.60417C19.5972%206.60417%2019.8542%206.71528%2020.0625%206.9375C20.2847%207.14583%2020.3958%207.40278%2020.3958%207.70833C20.3958%208.02778%2020.2847%208.28472%2020.0625%208.47917L10.4792%2018.0625C10.0764%2018.4792%209.58333%2018.6875%209%2018.6875C8.43056%2018.6875%207.9375%2018.4792%207.52083%2018.0625L3.9375%2014.4792C3.71528%2014.2847%203.60417%2014.0278%203.60417%2013.7083C3.60417%2013.4028%203.70833%2013.1458%203.91667%2012.9375C4.13889%2012.7153%204.40278%2012.6042%204.70833%2012.6042C5.02778%2012.6042%205.28472%2012.7153%205.47917%2012.9375L9.0625%2016.5208C9.04861%2016.4931%209.02778%2016.4792%209%2016.4792C8.97222%2016.4792%208.95139%2016.4931%208.9375%2016.5208L18.5208%206.9375Z'/%3E%3C/svg%3E");
  --m-checkbox-symbol-indeterminate: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='M18.8958%2010.8958C19.2014%2010.8958%2019.4583%2011.0069%2019.6667%2011.2292C19.8889%2011.4375%2020%2011.6944%2020%2012C20%2012.3056%2019.8889%2012.5694%2019.6667%2012.7917C19.4583%2013%2019.2014%2013.1042%2018.8958%2013.1042H5.10417C4.79861%2013.1042%204.53472%2013%204.3125%2012.7917C4.10417%2012.5694%204%2012.3056%204%2012C4%2011.6944%204.10417%2011.4375%204.3125%2011.2292C4.53472%2011.0069%204.79861%2010.8958%205.10417%2010.8958H18.8958Z'/%3E%3C/svg%3E");
}

/*
 * v1 styled any direct child span, so the fallback label and a slot that opens
 * with a span read the same. `1lh` is the span’s own font size times its line
 * height, which is exactly the expression v1’s `label.padding` token held.
 */
.m-checkbox > span {
  display: block;
  font-family: var(--app-font-family-text);
  font-size: var(--m-checkbox-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: var(--app-line-height);
  transform: translateY(calc((var(--m-checkbox-size) - 1lh) / 2));
  transition: all 100ms linear;
}

.m-checkbox[data-disabled='true'] * {
  pointer-events: none;
}

/*
 * v1’s `:after`: always in the box, taking a background and so becoming
 * visible only once the value is checked or mixed. The box paints the mask in
 * its own text colour, so the colour itself stays a utility.
 */
.m-checkbox .m-checkbox__symbol {
  display: block;
  height: var(--m-checkbox-symbol-size);
  max-height: 100%;
  max-width: 100%;
  width: var(--m-checkbox-symbol-size);
  background: transparent;
  mask-image: var(--m-checkbox-symbol);
  mask-size: 100% 100%;
}

.m-checkbox[data-state='checked'] .m-checkbox__symbol,
.m-checkbox[data-state='indeterminate'] .m-checkbox__symbol {
  background: currentcolor;
}

.m-checkbox[data-state='indeterminate'] .m-checkbox__symbol {
  mask-image: var(--m-checkbox-symbol-indeterminate);
}
</style>
