import { useState } from 'react'
import { Book } from '../book'
import { importBookInfo } from '@/books/importer/bookImporter'
import { registerBookClient } from '@/api/books'

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
    setBooks(books => {
      const existingState = books.find(bs => bs.isbn === isbn)
      const newState = updater(existingState ?? { isbn, status: 'loading' })
      return [newState, ...books.filter(bs => bs.isbn !== isbn)]
    })
  }

  const loadBookInfo = async (isbn: string) => {
    updateBookState(isbn, () => ({
      isbn,
      status: 'loading',
    }))
    try {
      const book = await importBookInfo(isbn)
      await registerBookClient(book)
      updateBookState(isbn, () => ({
        isbn,
        status: 'read',
        data: book,
      }))
    } catch (err) {
      console.error('Error importing', err)
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
