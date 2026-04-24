import { webcrypto } from 'crypto'
if (!globalThis.crypto) globalThis.crypto = webcrypto

import { createClient } from '@sanity/client'
import matter from 'gray-matter'
import { markdownToPortableText } from '@portabletext/markdown'
import fs from 'fs'
import path from 'path'

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: 'j4gu2dbr',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Delete all existing posts before re-importing
console.log('Deleting existing posts...')
const existing = await client.fetch(`*[_type == "post"]._id`)
for (const id of existing) {
  await client.delete(id)
}
console.log(`  Deleted ${existing.length} posts`)

const blogDir = 'src/content/blog'
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

console.log(`Migrating ${files.length} posts...`)

for (const file of files) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8')
  const { data, content } = matter(raw)
  const slug = file.replace(/\.md$/, '')

  // Upload thumbnail
  const thumbPath = `public${data.thumbnail}`
  let thumbnailRef
  if (fs.existsSync(thumbPath)) {
    const thumbAsset = await client.assets.upload('image', fs.createReadStream(thumbPath), {
      filename: path.basename(thumbPath),
    })
    thumbnailRef = { _type: 'image', asset: { _type: 'reference', _ref: thumbAsset._id } }
  } else {
    console.warn(`  ⚠ Thumbnail not found: ${thumbPath}`)
    thumbnailRef = undefined
  }

  // Convert markdown body to Portable Text (with table support)
  const body = markdownToPortableText(content, {
    types: {
      table: ({ context, value }) => ({
        _type: 'table',
        _key: context.keyGenerator(),
        rows: value.rows,
        headerRows: value.headerRows,
      }),
    },
  })

  const doc = {
    _type: 'post',
    title: data.title,
    slug: { _type: 'slug', current: slug },
    description: data.description,
    publishedAt: new Date(data.publishedAt).toISOString(),
    ...(data.updatedAt && { updatedAt: new Date(data.updatedAt).toISOString() }),
    ...(thumbnailRef && { thumbnail: thumbnailRef }),
    order: data.order,
    ...(data.craReference && { craReference: data.craReference }),
    body,
  }

  await client.create(doc)
  console.log(`  ✓ ${slug}`)
}

console.log('Done!')
