import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'richTable',
  title: 'Rich-text Table',
  type: 'object',
  fields: [
    defineField({
      name: 'headerRows',
      title: 'Header rows',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          title: 'Row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'cell',
                  title: 'Cell',
                  fields: [
                    {
                      name: 'value',
                      title: 'Content',
                      type: 'array',
                      of: [{type: 'block'}],
                    },
                  ],
                  preview: {
                    select: {value: 'value'},
                    prepare({value}: any) {
                      const text = (value?.[0]?.children ?? [])
                        .map((c: any) => c.text ?? '')
                        .join('')
                      return {title: text || '(empty cell)'}
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}: any) {
              const first = cells?.[0]?.value?.[0]?.children?.[0]?.text ?? ''
              return {title: first ? `Row: ${first}` : 'Row'}
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare({rows}: any) {
      return {title: `Table (${rows?.length ?? 0} rows)`}
    },
  },
})
