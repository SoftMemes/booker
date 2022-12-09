export interface Book {
  isbn: string
  authors: string[]
  categories?: string[]
  description?: string
  thumbnailUrl?: string
  language: string
  pageCount?: number | undefined
  publishedDate: string
  publisher: string
  title: string
}
