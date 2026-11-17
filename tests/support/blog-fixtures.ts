import type { PortableTextBlock } from '@portabletext/types'
import type { SanityPost } from '../../src/lib/sanity/types'

export const FIXTURE_SLUG = 'blog-body-fixture'
export const LARGE_REF = 'image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-2400x1600-jpg'
export const SMALL_REF = 'image-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-240x160-png'
export const PHOTO_ALT = 'Newcomers at a "welcome" table & a map <Canada>'
export const PHOTO_CAPTION = 'Photo credit: <img src=x onerror="window.injected=true"> & Unify'

export function textBlock(text: string, style = 'normal', key?: string): PortableTextBlock {
  return {
    _type: 'block',
    ...(key ? { _key: key } : {}),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: 'text', text, marks: [] }],
  }
}

export function articleBody() {
  const marked = textBlock('', 'h3', 'marked')
  marked.children = [
    { _type: 'span', _key: 'a', text: 'Bring ', marks: [] },
    { _type: 'span', _key: 'b', text: 'your documents', marks: ['strong', 'em'] },
    { _type: 'span', _key: 'c', text: ' & a plan', marks: ['link'] },
  ]
  marked.markDefs = [{ _type: 'link', _key: 'link', href: 'https://example.com/checklist' }]
  return [
    textBlock('An introduction before the first section.'),
    textBlock('Start here!', 'h2', 'start'),
    textBlock('This section explains the first step. '.repeat(18)),
    marked,
    textBlock('Keep these documents ready. '.repeat(12)),
    {
      _type: 'image', _key: 'cropped', asset: { _type: 'reference', _ref: LARGE_REF },
      alt: PHOTO_ALT, caption: PHOTO_CAPTION,
      crop: { left: 0.1, right: 0.2, top: 0.125, bottom: 0.125 },
      hotspot: { x: 0.7, y: 0.5, width: 0.2, height: 0.3 },
    },
    textBlock('Start here!', 'h2', 'repeat'),
    textBlock('Duplicate headings must still have different links. '.repeat(12)),
    textBlock('到达加拿大：第一步', 'h2'),
    textBlock('A section title can use any writing system. '.repeat(12)),
    { _type: 'image', _key: 'legacy', asset: { _type: 'reference', _ref: SMALL_REF } },
    { _type: 'image', _key: 'caption-only', asset: { _type: 'reference', _ref: SMALL_REF }, caption: 'A map of local services' },
    { _type: 'image', _key: 'missing' },
    { _type: 'image', _key: 'invalid', asset: { _ref: 'image-bad-0x10-jpg' } },
    textBlock('!!!', 'h3'),
    textBlock('A punctuation-only heading still has a link.'),
    textBlock('<script>window.injected=true</script> " & <img src=x onerror=alert(1)>', 'h2', 'escape"<> &'),
    textBlock(' ', 'h2', 'empty'),
    textBlock('Not a contents entry', 'h4', 'h4'),
    textBlock('A'.repeat(180), 'h3', 'long'),
    textBlock('Long section names must wrap within the article.'),
    {
      _type: 'table', _key: 'plain-table', rows: [
        { cells: ['Item', '<script>window.injected=true</script>'] },
        { cells: ['Map & guide', 'Available'] },
      ],
    },
    {
      _type: 'richTable', _key: 'rich-table', headerRows: 1, rows: [
        { cells: [{ value: [textBlock('Rich header')] }] },
        { cells: [{ value: [{ ...textBlock('Marked table cell'), children: [{ _type: 'span', text: 'Marked table cell', marks: ['strong'] }] }] }] },
      ],
    },
    textBlock('Final notes. '.repeat(100)),
  ]
}

export function blogFixture(request: Request, slug: string): SanityPost | null {
  if (slug !== FIXTURE_SLUG) return null
  const mode = request.headers.get('x-blog-fixture')
  if (!['article', 'simple', 'empty'].includes(mode ?? '')) return null
  return {
    _id: 'local-blog-body-fixture',
    title: 'Article sections and photos',
    slug: { current: FIXTURE_SLUG },
    description: 'A deterministic local article fixture.',
    publishedAt: '2026-11-01T12:00:00Z',
    thumbnail: { _type: 'image', asset: { _type: 'reference', _ref: 'image-cccccccccccccccccccccccccccccccccccccccc-1200x675-jpg' } },
    category: 'others',
    body: mode === 'empty' ? [] : mode === 'simple' ? [textBlock('An article without sections.')] : articleBody(),
  }
}
