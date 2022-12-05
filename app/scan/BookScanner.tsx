'use client'

import { useEffect, useState } from 'react'
import { BarcodeFormat } from '@zxing/library'
import { DecodeHintType, useZxing } from 'react-zxing'
import isbnResolver from 'node-isbn'

const resolveBook = async (isbn: string) => {
  const result = isbnResolver.resolve(isbn)
  console.log('Resolved', result)
  return result
}

const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13])

export default function Scan() {
  const [result, setResult] = useState('')
  const [resolving, setResolving] = useState(false)
  const { ref, start } = useZxing({
    timeBetweenDecodingAttempts: 100,
    hints,
    onResult(result) {
      const isbn = result.getText()
      const process = async () => {
        if (resolving) {
          return
        }

        setResolving(true)
        try {
          console.log(`Reading ${isbn}`)
          setResult(isbn)
          const data = await resolveBook(isbn)
          setResult(`${data.title} by ${data.authors.join(',')}`)
        } catch (err: any) {
          setResult('Error: ' + err.message)
        } finally {
          setResolving(false)
        }
      }
      process()
    },
    onError(error) {
      console.log('Fail fail', error)
    },
  })

  useEffect(() => {
    start()
  }, [])

  return (
    <>
      <video ref={ref} />
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </>
  )
}
