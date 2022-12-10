import { makeHandler } from '@/utils/apis'
import {
  registerBookRequestSchema,
  registerBookResponseSchema,
} from '@/api/books'
import { registerBook } from '@/books/registry/notionRegistry'

export default makeHandler(
  registerBookRequestSchema,
  registerBookResponseSchema,
  async book => {
    const created = await registerBook(book)
    return { created }
  },
)
