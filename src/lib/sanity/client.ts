import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: 'j4gu2dbr',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)

/**
 * Responsive, format-negotiated image URLs for on-page <img> tags. Thumbnails
 * are authored as large PNGs (one was 773 KB on /blog); `auto=format` lets the
 * Sanity CDN serve AVIF/WebP and `srcset` lets phones take a small width.
 * Keep plain `urlFor` (PNG/JPG) for OG and JSON-LD, which social crawlers read.
 */
export function responsiveImage(source: any, widths: number[], quality = 75) {
  const at = (w: number) => urlFor(source).width(w).auto('format').quality(quality).url()
  return {
    src: at(widths[Math.min(1, widths.length - 1)]),
    srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
  }
}
