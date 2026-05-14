// One-time cleanup for blog posts migrated via @portabletext/markdown.
//
// Bug background: the migration library leaves link markDef _keys open across
// subsequent spans (and even into next blocks/cells) instead of closing the
// mark at the end of the anchor text. Result: paragraphs and table cells get
// rendered as long underlined brand-red links far beyond the intended anchor.
//
// This script walks every post in Sanity, normalises span marks per these
// rules, and writes the cleaned bodies back:
//   1. Strip cross-block orphan markDef refs (mark key on a span whose block's
//      markDefs no longer contain that key — usually a leak from a prior block).
//   2. Strip within-block over-extension (a markDef ref kept only on the FIRST
//      span where it appears in the block; subsequent occurrences in the same
//      block are the bug and get removed).
//
// Decorators (strong, em, code, underline, strike-through, plus anything that
// doesn't match the 12-char hex markDef key pattern) are always preserved.
//
// Usage:
//   node scripts/fix-blog-link-marks.mjs                 # dry-run (read-only)
//   SANITY_WRITE_TOKEN=… node scripts/fix-blog-link-marks.mjs --apply
//
// Run from the repo root.

import { webcrypto } from 'crypto'
if (!globalThis.crypto) globalThis.crypto = webcrypto

import { createClient } from '@sanity/client'

const APPLY = process.argv.includes('--apply')
const VERBOSE = process.argv.includes('--verbose')

const token = process.env.SANITY_WRITE_TOKEN
if (APPLY && !token) {
  console.error('Missing SANITY_WRITE_TOKEN — required for --apply.')
  process.exit(1)
}

const client = createClient({
  projectId: 'j4gu2dbr',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: !APPLY,
})

const MARKDEF_KEY_RE = /^[a-f0-9]{12}$/

const stats = {
  postsScanned: 0,
  postsChanged: 0,
  blocksChanged: 0,
  spansChanged: 0,
  marksStripped: 0,
}

function cleanBlock(block) {
  if (block?._type === 'block') {
    const validKeys = new Set((block.markDefs ?? []).map((d) => d._key))
    const seenInBlock = new Set()
    let blockChanged = false

    for (const child of block.children ?? []) {
      if (child?._type !== 'span' || !Array.isArray(child.marks)) continue
      const before = child.marks
      const after = []
      for (const mark of before) {
        // Decorator (strong, em, code, etc.) — preserve.
        if (!MARKDEF_KEY_RE.test(mark)) {
          after.push(mark)
          continue
        }
        // Cross-block orphan — markDef no longer declared on this block.
        if (!validKeys.has(mark)) continue
        // Within-block over-extension — keep only first occurrence in the block.
        if (seenInBlock.has(mark)) continue
        seenInBlock.add(mark)
        after.push(mark)
      }
      if (after.length !== before.length) {
        if (VERBOSE) {
          console.log(`      span "${(child.text ?? '').slice(0, 60)}…"`)
          console.log(`        before: [${before.join(', ')}]`)
          console.log(`        after:  [${after.join(', ')}]`)
        }
        child.marks = after
        stats.spansChanged++
        stats.marksStripped += before.length - after.length
        blockChanged = true
      }
    }
    return blockChanged
  }

  if ((block?._type === 'table' || block?._type === 'richTable') && Array.isArray(block.rows)) {
    let tableChanged = false
    for (const row of block.rows) {
      for (const cell of row?.cells ?? []) {
        for (const cellBlock of cell?.value ?? []) {
          if (cleanBlock(cellBlock)) tableChanged = true
        }
      }
    }
    return tableChanged
  }

  return false
}

console.log(APPLY ? '⚡ APPLY mode — will write changes.' : '🔎 DRY RUN — no writes.')

const posts = await client.fetch(`*[_type == "post"]{_id, _rev, title, "slug": slug.current, body}`)
console.log(`Found ${posts.length} posts.\n`)

const writes = []

for (const post of posts) {
  stats.postsScanned++
  const original = JSON.stringify(post.body)
  const body = JSON.parse(original)
  let changed = false
  for (const block of body) {
    if (cleanBlock(block)) {
      changed = true
      stats.blocksChanged++
    }
  }
  if (changed) {
    stats.postsChanged++
    console.log(`  • ${post.title}  (${post.slug})`)
    if (APPLY) {
      writes.push(
        client
          .patch(post._id)
          .set({ body })
          .ifRevisionId(post._rev)
          .commit()
          .then(() => console.log(`    ✓ patched`))
          .catch((err) => console.error(`    ✗ patch failed: ${err.message}`))
      )
    }
  }
}

if (APPLY) {
  console.log('\nApplying patches…')
  await Promise.all(writes)
}

console.log('\n────── summary ──────')
console.log(`posts scanned:  ${stats.postsScanned}`)
console.log(`posts changed:  ${stats.postsChanged}`)
console.log(`blocks changed: ${stats.blocksChanged}`)
console.log(`spans changed:  ${stats.spansChanged}`)
console.log(`marks stripped: ${stats.marksStripped}`)
if (!APPLY) console.log('\nRe-run with `SANITY_WRITE_TOKEN=… node scripts/fix-blog-link-marks.mjs --apply` to write changes.')
