import { useClipboard } from '@vueuse/core'
import { Ref, unref } from 'vue'

export type glyphToSvgParams = {
  fontSize: Ref<number> | number
  fontWeight: Ref<number> | number
  fontFile: any
}

export function useGlyphToSvg({
  fontSize,
  fontWeight,
  fontFile,
}: glyphToSvgParams) {
  const { copy } = useClipboard()

  const loadVariableFont = () => {
    // @ts-ignore
    const variableFont = fontFile.value.getVariation({
      wght: unref(fontWeight),
    })
    return variableFont
  }

  const convertToSvg = (glyph: any) => {
    // Scale according to current font size
    const scale = unref(fontSize) / fontFile.value.unitsPerEm
    const path = glyph.path.scale(scale, scale).scale(-1, 1).rotate(Math.PI)

    // Center inside square bounding box
    const bbox = path.bbox
    const minX = bbox.minX
    const minY = bbox.minY
    const height = bbox.height
    const width = bbox.width
    const dims = unref(fontSize)

    const centeredY = (height - dims) / 2 + minY
    const centeredX = (width - dims) / 2 + minX

    const viewBox = `${centeredX} ${centeredY} ${dims} ${dims}`

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" xmlns:xlink="http://www.w3.org/1999/xlink">`
    svg += `<path d="${path.toSVG()}" fill="currentColor" />`
    svg += '</svg>'

    return svg
  }

  const renderSvg = async (codePoint: any) => {
    const font = await loadVariableFont()
    const glyph = font.glyphForCodePoint(codePoint)
    const svg = convertToSvg(glyph)
    return svg
  }

  const copySvg = async (codePoint: any) => {
    const svg = await renderSvg(codePoint)
    copy(svg)
  }

  return { copySvg, renderSvg }
}
