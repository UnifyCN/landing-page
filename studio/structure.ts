import {Iframe} from 'sanity-plugin-iframe-pane'
import type {StructureResolver} from 'sanity/structure'

const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://unifysocial.ca'
    : 'http://localhost:4321'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog Post')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Blog Post')
            .child((id) =>
              S.document()
                .documentId(id)
                .schemaType('post')
                .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc: any) =>
                        doc?.slug?.current
                          ? `${SITE_URL}/blog/${doc.slug.current}`
                          : SITE_URL,
                      reload: {button: true},
                    })
                    .title('Preview'),
                ]),
            ),
        ),
    ])
