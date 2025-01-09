import prettierPluginVitepress from 'prettier-plugin-vitepress'

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export const prettierPreset = {
  plugins: [prettierPluginVitepress],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
}
