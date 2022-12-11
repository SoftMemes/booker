import * as Sentry from '@sentry/nextjs'
import { Struct } from 'superstruct'
import { Session } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextAuth]'

export const makeHandler =
  <TReq, TRes>(
    requestSchema: Struct<TReq>,
    responseSchema: Struct<TRes>,
    handler: (request: TReq, session: Session) => Promise<TRes>,
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) {
        res.status(401).send('Not authenticated')
        return
      }

      const [err, typedRequest] = requestSchema.validate(req.body, {
        coerce: true,
      })
      if (err) {
        res.status(400).send(err.message)
        return
      }

      const response = await handler(typedRequest, session)

      // Paranoia cause, javascript
      if (!responseSchema.is(response)) {
        throw new Error('Server attempted to send malformed response')
      }

      res.json(response)
    } catch (err) {
      Sentry.captureException(err)
      throw err
    }
  }
