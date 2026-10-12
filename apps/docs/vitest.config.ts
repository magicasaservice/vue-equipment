import { defineConfig } from 'vitest/config'

export default defineConfig({
  // The project tsconfig only references the files `nuxt prepare` writes to
  // .nuxt, which a fresh checkout doesn’t have. The tests cover a Node module
  // that needs none of its options.
  oxc: { tsconfig: false },
})
