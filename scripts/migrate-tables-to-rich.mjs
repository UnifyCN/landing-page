// One-time migration: rename `_type: 'table'` → `_type: 'richTable'` on the
// table blocks that came from the original markdown→Sanity migration.
//
// Why: those blocks have rich-text cells (`{_key, _type: 'cell', value:
// PortableText[]}`) which the @sanity/table v2 plugin can't render — opening
// any such post in Studio throws React error #31. We add a separate custom
// `richTable` schema that natively accepts the migrated shape; this script
// retypes the existing data so Studio loads it.
//
// Touches only `_type` at the table-block level. Cell shape, content, marks,
// and markDefs are unchanged.
//
// Usage:
//   node scripts/migrate-tables-to-rich.mjs                 # dry-run
//   SANITY_WRITE_TOKEN=… node scripts/migrate-tables-to-rich.mjs --apply

import {webcrypto} from 'crypto'
if (!globalThis.crypto) globalThis.crypto = webcrypto

import {createClient} from '@sanity/client'

const APPLY = process.argv.includes('--apply')

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

console.log(APPLY ? '⚡ APPLY mode — will write changes.' : '🔎 DRY RUN — no writes.')

const posts = await client.fetch(
  `*[_type == "post" && count(body[_type == "table"]) > 0]{_id, _rev, title, "slug": slug.current, body}`
)
console.log(`Found ${posts.length} posts with legacy table blocks.\n`)

const writes = []
let totalBlocksRenamed = 0

for (const post of posts) {
  const body = JSON.parse(JSON.stringify(post.body))
  let renamedInPost = 0
  for (const block of body) {
    if (block?._type === 'table') {
      block._type = 'richTable'
      renamedInPost++
      totalBlocksRenamed++
    }
  }
  if (renamedInPost > 0) {
    console.log(`  • ${post.title}  (${renamedInPost} block${renamedInPost > 1 ? 's' : ''})`)
    if (APPLY) {
      writes.push(
        client
          .patch(post._id)
          .set({body})
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
console.log(`posts touched:        ${posts.length}`)
console.log(`table blocks renamed: ${totalBlocksRenamed}`)
if (!APPLY)
  console.log(
    '\nRe-run with `SANITY_WRITE_TOKEN=… node scripts/migrate-tables-to-rich.mjs --apply` to write.'
  )
