import { Book } from './book'
import { useState } from 'react'
import isbnResolver from 'node-isbn'

export interface BookImportState {
  isbn: string
  status: 'loading' | 'read' | 'failed'
  data?: Book
}

export const useBookImporter = () => {
  const [books, setBooks] = useState<BookImportState[]>([])

  const updateBookState = (
    isbn: string,
    updater: (state: BookImportState) => BookImportState,
  ) => {
    const existingState = books.find(bs => bs.isbn === isbn)
    const newState = updater(existingState ?? { isbn, status: 'loading' })
    setBooks([newState, ...books.filter(bs => bs.isbn !== isbn)])
  }

  const loadBookInfo = async (isbn: string) => {
    updateBookState(isbn, () => ({
      isbn,
      status: 'loading',
    }))
    try {
      const result = await isbnResolver.resolve(isbn)
      updateBookState(isbn, () => ({
        isbn,
        status: 'read',
        data: {
          title: result.title,
          authors: result.authors,
          categories: result.categories,
          description: result.description,
          thumbnailUrl: result.imageLinks?.thumbnail,
          language: result.language,
          pageCount: result.pageCount,
          publisher: result.publisher,
          publishedDate: result.publishedDate,
        },
      }))
    } catch (err) {
      updateBookState(isbn, () => ({
        isbn,
        status: 'failed',
      }))
    }
  }
  const importBook = (isbn: string) => {
    const hasOrLoadingBook = books.find(
      bs => bs.isbn === isbn && bs.status !== 'failed',
    )
    if (!hasOrLoadingBook) {
      // Don't do it again if we're doing it
      loadBookInfo(isbn)
    }
  }

  return {
    books,
    importBook,
  }
}
