export interface SanityImageRef {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
}

export interface SanityPostStub {
  _id: string
  title: string
  slug: { current: string }
  description: string
  publishedAt: string
  thumbnail: SanityImageRef
}

export interface SanityPost extends SanityPostStub {
  updatedAt?: string
  craReference?: string
  body: any[]
}
