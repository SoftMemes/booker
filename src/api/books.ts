import { array, boolean, number, object, optional, string } from 'superstruct'
import { makeClient } from '@/utils/apis/makeClient'

export const registerBookRequestSchema = object({
  isbn: string(),
  authors: array(string()),
  categories: optional(array(string())),
  description: optional(string()),
  thumbnailUrl: optional(string()),
  language: optional(string()),
  pageCount: optional(number()),
  publishedDate: optional(string()),
  publisher: optional(string()),
  title: string(),
  format: optional(string()),
})

export const registerBookResponseSchema = object({
  created: boolean(),
})

export const registerBookClient = makeClient(
  registerBookRequestSchema,
  registerBookResponseSchema,
  '/api/books/register',
)
