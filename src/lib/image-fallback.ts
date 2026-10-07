// Every AVIF this site serves has a WebP of the same name beside it (made by
// scripts/build-brand-images.mjs). Markup pattern, so that Safari 15 and older,
// which cannot decode AVIF, still get an image instead of alt text:
//
//   <picture class="contents">
//     <source srcset={src} type="image/avif" />
//     <img src={webpFallback(src)} ... />
//   </picture>
//
// `class="contents"` (display: contents) keeps the <img> laid out exactly as if
// the <picture> were not there, so existing CSS on the image and its parent
// still applies.
export function webpFallback(avif: string): string {
  // Also inside a srcset ("a.avif 380w, b.avif 760w") and before a query string
  // or fragment ("a.avif?v=2").
  return avif.replace(/\.avif(?=$|[\s?#])/g, ".webp");
}
