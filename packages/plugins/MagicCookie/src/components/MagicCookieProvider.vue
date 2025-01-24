<template>
  <client-only>
    <div class="magic-cookie">
      <div class="magic-cookie__container">
        <div class="magic-cookie__body">
          <slot />
        </div>
      </div>
      <div class="magic-cookie__footer">
        <slot name="footer" />
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { provide, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useCookieStore } from '../composables/private/useCookieStore'
import { defaultOptions } from '../utils/defaultOptions'
import {
  MagicCookieId,
  MagicCookieList,
  MagicCookieOptionsKey,
} from '../symbols'

import type { MagicCookie, MagicCookieOptions } from '../types'

type MagicCookieProviderProps = {
  id: MaybeRef<string>
  cookies: MagicCookie[]
  options?: MagicCookieOptions
}

const { id, cookies, options } = defineProps<MagicCookieProviderProps>()

const mappedOptions = defu(options, defaultOptions)

const { cookieStore } = useCookieStore({
  id,
  cookies,
  maxAge: mappedOptions.maxAge,
})

provide(MagicCookieId, id)
provide(MagicCookieList, cookieStore?.cookies)
provide(MagicCookieOptionsKey, mappedOptions)
</script>

<style>
:root {
  --magic-cookie-preferences-mask: linear-gradient(
    to top,
    rgb(255 255 255 / 0%),
    rgb(255 255 255 / 100%) 1.5rem
  );
}

.magic-cookie {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.magic-cookie__container {
  width: 100%;
  max-height: var(--magic-cookie-max-height, calc(100vh - 2rem));
  display: flex;
  flex-direction: column;
  gap: var(--magic-cookie-container-gap, 0);
}

.magic-cookie__body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--magic-cookie-body-padding-bottom, 1rem);
  mask: var(--magic-cookie-preferences-mask);
  overflow-y: var(--magic-cookie-body-overflow-y, auto);
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.magic-cookie__body::-webkit-scrollbar {
  display: none;
}

.magic-cookie__footer {
  width: 100%;
}
</style>
