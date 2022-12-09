import { Client } from '@notionhq/client'
import { Book } from '../book'

const makeText = (text: string) => ({
  rich_text: [
    {
      text: {
        content: text,
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

const makeDate = (date: string) => ({
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
    Title: makeTitle(book.title),
    ISBN: makeText(book.isbn),
    Publisher: makeSelect(book.publisher),
    Authors: makeMultiSelect(book.authors),
    Description: book.description ? makeText(book.description) : undefined,
    Categories: book.categories ? makeMultiSelect(book.categories) : undefined,
    'Published Date': makeDate(book.publishedDate),
    Language: makeSelect(book.language),
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
