import { Struct } from 'superstruct'
import axios from 'axios'

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
      response.data,
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
