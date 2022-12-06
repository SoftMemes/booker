import { Client } from '@notionhq/client'
import { Book } from './book'

const auth = 'secret_81u6MwwbOiNMcUC0EzgFGjWiZkQYSLutNqepThOxN8O'
const databaseId = 'ad604bcddfbd4743a78b34c3c84f5daf'

export const importBook = async (book: Book): Promise<void> => {
  // TODO: Don't hardcode, kill this code, change to OAuth
  const client = new Client({
    auth,
  })
  const existing = await client.databases.query({
    database_id: databaseId,
    filter: { property: 'ISBN', rich_text: { equals: book.isbn } },
  })

  const properties = {
    Title: {
      title: { rich_text: [{ type: 'text', text: { content: book.title } }] },
    },
    /*
    ISBN: {
      type: 'rich_text',
      rich_text: [{ type: 'text', text: { content: book.isbn } }],
    },
    Authors: { multi_select: book.authors.map(author => ({ name: author })) },
    Description: { rich_text: [{ text: book.description }] },
    Categories: {
      multi_select: book.categories.map(category => ({ name: category })),
    },
    'Published Date': { date: book.publishedDate },
    Publisher: { select: book.publisher },
    Language: { select: book.language },
    *
     */
  }

  if (existing.results.length) {
    await client.pages.update({
      page_id: existing.results[0].id,
      properties: properties,
    })
  } else {
    await client.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
    })
  }
}
