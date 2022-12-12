import { useEffect } from 'react'
import { registerBookClient } from '@/api/books'

const books = []

const Page = () => {
  useEffect(() => {
    const hack = async () => {
      for (const book of books) {
        console.log('Doing ', book)
        try {
          await registerBookClient({
            isbn: book.ISBN,
            title: book.Title,
            authors: book.Authors.split(',').map(a => a.trim()),
            format: book.Format,
          })
        } catch (err) {
          console.log('Fail', err.message)
        }
      }
    }

    hack()
  }, [])

  return <span>Doing it so much</span>
}

export default Page
