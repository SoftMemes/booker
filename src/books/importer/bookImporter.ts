import isbnResolver from 'node-isbn'
import { Book } from '@/books/book'

export const importBookInfo = async (isbn: string): Promise<Book> => {
  const result = await isbnResolver
    .provider(['google', 'worldcat', 'openlibrary'])
    .resolve(isbn)
  return {
    isbn,
    title: result.title,
    authors: result.authors ?? [],
    categories: result.categories,
    description: result.description,
    thumbnailUrl: result.imageLinks?.thumbnail,
    language: result.language,
    pageCount: result.pageCount,
    publisher: result.publisher,
    publishedDate: result.publishedDate,
    format: 'Book',
  }
}
