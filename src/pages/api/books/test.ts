import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextAuth]'
import { Client } from '@notionhq/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send('Not authenticated')
    return
  }

  const client = new Client({
    auth: session.accessToken,
  })

  const dbResult = await client.search({
    filter: { property: 'object', value: 'database' },
  })
  res.json(dbResult.results)
}

export default handler
