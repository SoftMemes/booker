import { Struct } from 'superstruct'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export const makeHandler =
  <TReq, TRes>(
    requestSchema: Struct<TReq>,
    responseSchema: Struct<TRes>,
    handler: (request: TReq) => Promise<TRes>,
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('HEEEEER' + req)
    const [err, typedRequest] = requestSchema.validate(req, { coerce: true })
    if (err) {
      res.status(400).send(err.message)
      return
    }

    const response = await handler(typedRequest)

    // Paranoia cause, javascript
    if (!responseSchema.is(response)) {
      res.status(500).send('Server returned bad response')
    }

    res.status(200).send(response)
  }

export const makeClient =
  <TReq, TRes>(
    requestSchema: Struct<TReq>,
    responseSchema: Struct<TRes>,
    endpoint: string,
    method = 'post',
  ) =>
  async (request: TReq): Promise<TRes> => {
    const [requestValidationErr] = requestSchema.validate(request)
    if (requestValidationErr) {
      throw new Error(
        'Invalid request, check yo typing: ' + requestValidationErr.message,
      )
    }

    const response = await axios.request({
      url: endpoint,
      method,
      data: request,
    })
    const [responseValidationErr, typedResponse] = responseSchema.validate(
      response,
      { coerce: true },
    )

    // Paranoia cause, javascript
    if (responseValidationErr) {
      throw new Error(
        'Server returned invalid response: ' + responseValidationErr.message,
      )
    }

    return typedResponse
  }
