# MagicError

MagicError is a composable and a class used throughout Vue Equipment for error handling and logging. It allows you to throw custom errors including a source, error code, timestamp and an automatically prefixed message.

## Anatomy

```vue
<script setup>
import { useMagicError, type UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'

const { logError, logWarning, throwError } = useMagicError({
  prefix: 'CustomPrefix',
  source: 'CustomSource',
})

logError('An error occurred')
logWarning('This is a warning')

throwError({ message: 'An error occurred', errorCode: 'custom_error_code' })
</script>
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Nuxt

The plugin is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicError` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicError'],
  },
})
```

### Composable

In order to throw errors from anywhere within your app, import the `useMagicError` composable.

```js
import { useMagicError, type UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'

const { throwError, logError, logWarning } = useMagicError({
  prefix: 'CustomPrefix',
  source: 'CustomSource',
})
```

::tip
If you have installed the plugin as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## Peer Dependencies

MagicError has no optional peer dependencies. It only relies on the [core peer dependencies](/overview/getting-started#core), which npm, pnpm and bun install automatically.

## Typescript

The `useMagicError` composable is fully typesafe. The `UseMagicErrorReturn` type can be imported seperately.

### Assert

Due to how the typescript compiler works, you need to explicitly type the return value when calling `useMagicError` and refrain from destructuring it.

```ts
import { inject } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'

const magicError: UseMagicErrorReturn = useMagicError()
const customRef = inject('custom-ref', undefined)

magicError.assert(customRef, {
  message: 'customRef must be provided',
  errorCode: 'custom_ref_required',
})

alert('customRef is valid')
```
