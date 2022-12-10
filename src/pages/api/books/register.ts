import { makeHandler } from '@/utils/apis/makeHandler'
import {
  registerBookRequestSchema,
  registerBookResponseSchema,
} from '@/api/books'
import { registerBook } from '@/books/registry/notionRegistry'

export default makeHandler(
  registerBookRequestSchema,
  registerBookResponseSchema,
  async (book, session) => {
    const created = await registerBook(book, session.accessToken)
    return { created }
  },
)
