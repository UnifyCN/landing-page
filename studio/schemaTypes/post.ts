import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'updatedAt', title: 'Updated At', type: 'datetime' }),
    defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true }, validation: (R) => R.required() }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Higher = appears first. Featured post = highest number.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'craReference',
      title: 'CRA Reference',
      type: 'string',
      description: 'Optional. e.g. "T1 General, Schedule 1"',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'table' },
      ],
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { title: 'title', order: 'order', media: 'thumbnail' },
    prepare({ title, order, media }: any) {
      return { title, subtitle: `Order: ${order}`, media }
    },
  },
})
