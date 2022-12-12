import * as Sentry from '@sentry/nextjs'
import { Client } from '@notionhq/client'
import formatISO from 'date-fns/formatISO'
import { Book } from '../book'
import { parseMultiple } from '@/utils/dates'

const makeText = (text: string) => ({
  rich_text: [
    {
      text: {
        content:
          text.length > 2000 ? text.substring(0, 2000 - 3) + '...' : text,
      },
    },
  ],
})

const makeTitle = (title: string) => ({
  title: [
    {
      text: {
        content: title,
      },
    },
  ],
})

const makeSelect = (name: string) => ({
  select: {
    name,
  },
})

const makeMultiSelect = (names: string[]) => ({
  multi_select: names.map(name => ({
    name,
  })),
})

const makeDate = (date: string | null | undefined) =>
  date
    ? {
        date: {
          start: date,
        },
      }
    : undefined

const sanitizeDate = (date: string) => {
  if (!date) {
    return undefined
  }

  const parsedDate = parseMultiple(
    date,
    ['yyyy-MM-dd', 'yyyy-M-d', 'yyyy-MM', 'yyyy', 'MMM dd, yyyy', 'MMM, yyyy'],
    new Date('2022-01-01'),
  )
  if (parsedDate) {
    return formatISO(parsedDate, { representation: 'date' })
  } else {
    Sentry.captureMessage(`Rejecting date in unsupported format: ${date}`)
    return undefined
  }
}

const sanitizeAuthor = (category: string) => category.replace(',', ' ')

const sanitizePublisher = (category: string) => category.replace(',', ' ')

const sanitizeCategory = (category: string) => category.replace(',', '-')

// TODO: This picks the first shared DB regardless of shape, hacky hacky
const getFirstDatabaseId = async (notionClient: Client) => {
  const dbResult = await notionClient.search({
    filter: { property: 'object', value: 'database' },
  })

  if (dbResult.results.length) {
    return dbResult.results[0].id
  } else {
    throw new Error('No databases found')
  }
}

export const registerBook = async (
  book: Book,
  accessToken: string,
): Promise<boolean> => {
  const client = new Client({
    auth: accessToken,
  })

  const databaseId = await getFirstDatabaseId(client)
  const existing = await client.databases.query({
    database_id: databaseId,
    filter: { property: 'ISBN', rich_text: { equals: book.isbn } },
  })

  const properties = {
    Title: makeTitle(book.title),
    ISBN: makeText(book.isbn),
    Publisher: book.publisher
      ? makeSelect(sanitizePublisher(book.publisher))
      : undefined,
    Authors: makeMultiSelect(
      book.authors.map(author => sanitizeAuthor(author)),
    ),
    Description: book.description ? makeText(book.description) : undefined,
    Categories: book.categories
      ? makeMultiSelect(
          book.categories.map(category => sanitizeCategory(category)),
        )
      : undefined,
    'Published Date': book.publishedDate
      ? makeDate(sanitizeDate(book.publishedDate))
      : undefined,
    Language: book.language ? makeSelect(book.language) : undefined,
    Format: book.format ? makeSelect(book.format) : undefined,
  }

  if (existing.results.length) {
    await client.pages.update({
      page_id: existing.results[0].id,
      // NOTE: Type definitions are somehow not working, much weirdness
      properties: properties as any,
      icon: book.thumbnailUrl
        ? { external: { url: book.thumbnailUrl } }
        : undefined,
    })
    return false
  } else {
    await client.pages.create({
      parent: { database_id: databaseId },
      // NOTE: Type definitions are somehow not working, much weirdness
      properties: properties as any,
      icon: book.thumbnailUrl
        ? { external: { url: book.thumbnailUrl } }
        : undefined,
    })
    return true
  }
}
