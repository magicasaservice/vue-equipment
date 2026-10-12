import { queryCollection } from '@nuxt/content/server'

/**
 * `/raw/plugins/MagicDrawer.md` returns the markdown behind
 * `/plugins/MagicDrawer`, as written. The page records which file it was read
 * from, and the file itself travels as a server asset.
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'path') ?? ''
  const path = `/${slug.replace(/\.md$/, '')}`

  const page = await queryCollection(event, 'docs')
    .path(path)
    .select('sourcePath')
    .first()

  const markdown = page?.sourcePath
    ? await useStorage('assets:markdown').getItem<string>(page.sourcePath)
    : null

  if (!markdown) {
    throw createError({ statusCode: 404, statusMessage: 'No such page' })
  }

  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return markdown
})
