import { Client } from '@notionhq/client'
import { Book } from '../book'

const makeSelect = (name: string) => ({
  type: 'select',
  select: {
    name,
  },
})

const makeMultiSelect = (names: string[]) => ({
  type: 'multi_select',
  multi_select: names.map(name => ({
    name,
  })),
})

const makeDate = (date: string) => ({
  type: 'date',
  date: {
    start: date,
  },
})

export const registerBook = async (book: Book): Promise<boolean> => {
  const notionApiKey = process.env.NOTION_API_KEY!
  const databaseId = process.env.NOTION_DATABASE_ID!

  const client = new Client({
    auth: notionApiKey,
  })
  const existing = await client.databases.query({
    database_id: databaseId,
    filter: { property: 'ISBN', rich_text: { equals: book.isbn } },
  })

  const properties = {
    Title: book.title,
    ISBN: book.isbn,
    Publisher: makeSelect(book.publisher),
    Authors: makeMultiSelect(book.authors),
    Description: book.description,
    Categories: makeMultiSelect(book.categories),
    'Published Date': makeDate(book.publishedDate),
    Language: makeSelect(book.language),
  }

  if (existing.results.length) {
    await client.pages.update({
      page_id: existing.results[0].id,
      // NOTE: Type definitions are somehow not working, much weirdness
      properties: properties as any,
    })
    return false
  } else {
    await client.pages.create({
      parent: { database_id: databaseId },
      // NOTE: Type definitions are somehow not working, much weirdness
      properties: properties as any,
    })
    return true
  }
}
