import { escapeHTML, toHTML, type PortableTextOptions } from '@portabletext/to-html'
import type { PortableTextBlock, TypedObject } from '@portabletext/types'
import { urlFor } from './client'

export interface ContentsEntry {
  id: string
  text: string
  level: 2 | 3
}

interface BodyImage extends TypedObject {
  asset?: { _ref?: string }
  alt?: string
  caption?: string
  crop?: { top: number; bottom: number; left: number; right: number }
}

const headingId = Symbol('article-heading-id')
type HeadingBlock = PortableTextBlock & { [headingId]?: string }

const textValue = (value: unknown) => typeof value === 'string' ? value.trim() : ''

function keyFragment(key: string) {
  return Array.from(key, (character) => /^[a-z0-9_-]$/i.test(character)
    ? character
    : `~${character.codePointAt(0)!.toString(16)}~`).join('')
}

function renderImage(value: BodyImage) {
  const ref = value.asset?._ref
  const match = typeof ref === 'string'
    ? /^image-([a-zA-Z0-9]+)-([1-9]\d*)x([1-9]\d*)-(jpg|jpeg|png|webp|gif|avif|svg|tif|tiff)$/.exec(ref)
    : null
  if (!match) return ''

  const originalWidth = Number(match[2])
  const originalHeight = Number(match[3])
  if (!Number.isSafeInteger(originalWidth) || !Number.isSafeInteger(originalHeight)) return ''

  const crop = value.crop
  const validCrop = crop && ['top', 'bottom', 'left', 'right'].every((side) => {
    const fraction = crop[side as keyof typeof crop]
    return typeof fraction === 'number' && Number.isFinite(fraction) && fraction >= 0 && fraction < 1
  }) && crop.left + crop.right < 1 && crop.top + crop.bottom < 1
  const width = validCrop
    ? Math.round(originalWidth - crop.right * originalWidth - Math.round(crop.left * originalWidth))
    : originalWidth
  const height = validCrop
    ? Math.round(originalHeight - crop.bottom * originalHeight - Math.round(crop.top * originalHeight))
    : originalHeight
  if (width < 1 || height < 1) return ''

  const source = { asset: { _ref: ref }, ...(validCrop ? { crop } : {}) }
  const maxWidth = Math.min(width, 1440)
  const widths = [...new Set([320, 480, 720, 1080, maxWidth].filter((candidate) => candidate <= maxWidth))].sort((a, b) => a - b)
  const at = (candidate: number) => urlFor(source).width(candidate).fit('max').auto('format').quality(80).url()
  const displayWidth = Math.min(width, 720)
  const sizes = `(max-width: 809px) min(${displayWidth}px, calc(100vw - 3rem)), (max-width: 1399px) ${Math.min(width, 704)}px, ${displayWidth}px`
  const caption = textValue(value.caption)
  const alt = textValue(value.alt) || caption

  return `<figure class="article-photo" style="max-width: ${displayWidth}px"><img src="${escapeHTML(at(Math.min(maxWidth, 720)))}" srcset="${escapeHTML(widths.map((candidate) => `${at(candidate)} ${candidate}w`).join(', '))}" sizes="${sizes}" width="${width}" height="${height}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async">${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}</figure>`
}

export function renderBlogBody<B extends TypedObject>(body: B[] | null | undefined) {
  const blocks = body ?? []
  const candidates = blocks.flatMap((block, index) => {
    if (block._type !== 'block') return []
    const value = block as B & PortableTextBlock
    if (value.style !== 'h2' && value.style !== 'h3') return []
    const text = value.children.filter((child) => child._type === 'span')
      .map((child) => typeof child.text === 'string' ? child.text : '').join('').replace(/\s+/g, ' ').trim()
    if (!text) return []
    const slug = text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section'
    const base = value._key ? `section-${keyFragment(value._key)}` : `heading-${slug}`
    return [{ index, base, text, level: value.style === 'h2' ? 2 as const : 3 as const }]
  })
  const reserved = new Set(candidates.map((entry) => entry.base))
  const used = new Set<string>()
  const ids = new Map<number, string>()
  const contents: ContentsEntry[] = candidates.map(({ index, base, text, level }) => {
    let id = base
    let suffix = 2
    while (used.has(id) || (id !== base && reserved.has(id))) {
      id = `${base}-${suffix++}`
    }
    used.add(id)
    ids.set(index, id)
    return { id, text, level }
  })
  const prepared = blocks.map((block, index) => ({ ...block, [headingId]: ids.get(index) }))
  const heading = (tag: 'h2' | 'h3') => ({ value, children }: { value: HeadingBlock; children?: string }) => {
    const id = value[headingId]
    return `<${tag}${id ? ` id="${escapeHTML(id)}" tabindex="-1"` : ''}>${children ?? ''}</${tag}>`
  }
  const options: PortableTextOptions = {
    components: {
      block: { h2: heading('h2'), h3: heading('h3') },
      types: {
        image: ({ value }) => renderImage(value),
        table: ({ value }) => {
          const rows = value.rows ?? []
          if (!rows.length) return ''
          const [headerRow, ...bodyRows] = rows
          const thead = `<thead><tr>${headerRow.cells.map((cell: string) => `<th>${escapeHTML(cell)}</th>`).join('')}</tr></thead>`
          const tbody = bodyRows.length
            ? `<tbody>${bodyRows.map((row: { cells: string[] }) => `<tr>${row.cells.map((cell) => `<td>${escapeHTML(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`
            : ''
          return `<table>${thead}${tbody}</table>`
        },
        richTable: ({ value }) => {
          const rows = value.rows ?? []
          if (!rows.length) return ''
          const headerCount: number = value.headerRows ?? 0
          const header = rows.slice(0, headerCount)
          const tableBody = rows.slice(headerCount)
          const renderCells = (cells: { value?: TypedObject[] }[], tag: 'th' | 'td') =>
            cells.map((cell) => `<${tag}>${toHTML(cell.value ?? [], options)}</${tag}>`).join('')
          const thead = header.length ? `<thead><tr>${renderCells(header[0].cells, 'th')}</tr></thead>` : ''
          const tbody = tableBody.length
            ? `<tbody>${tableBody.map((row: { cells: { value?: TypedObject[] }[] }) => `<tr>${renderCells(row.cells, 'td')}</tr>`).join('')}</tbody>`
            : ''
          return `<table>${thead}${tbody}</table>`
        },
      },
    },
  }
  return { html: toHTML(prepared, options), contents }
}
