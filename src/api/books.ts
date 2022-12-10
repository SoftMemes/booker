import { array, boolean, number, object, optional, string } from 'superstruct'
import { makeClient } from '@/utils/apis/makeClient'

export const registerBookRequestSchema = object({
  isbn: string(),
  authors: array(string()),
  categories: optional(array(string())),
  description: optional(string()),
  thumbnailUrl: optional(string()),
  language: string(),
  pageCount: optional(number()),
  publishedDate: string(),
  publisher: optional(string()),
  title: string(),
})

export const registerBookResponseSchema = object({
  created: boolean(),
})

export const registerBookClient = makeClient(
  registerBookRequestSchema,
  registerBookResponseSchema,
  '/api/books/register',
)
