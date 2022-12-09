'use client'

import { useEffect, useRef } from 'react'
import { BarcodeFormat } from '@zxing/library'
import { DecodeHintType, useZxing } from 'react-zxing'
import {
  BookImportState,
  useBookImporter,
} from '@/books/importer/useBookImporter'
import Scanner from '@/barcodes/Scanner'

const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13])

function statusIcon(status: BookImportState['status']): string {
  switch (status) {
    case 'failed':
      return '❌'
    case 'loading':
      return '⌛'
    case 'read':
      return '✅'
    default:
      return '?'
  }
}

export default function Scan() {
  const { books, importBook } = useBookImporter()
  const { ref, start } = useZxing({
    timeBetweenDecodingAttempts: 100,
    hints,
    onResult(result) {
      const isbn = result.getText()
      importBook(isbn)
    },
    onError(error) {
      console.log('Fail fail', error)
    },
  })

  const scannerRef = useRef(null)

  useEffect(() => {
    start()
  }, [])

  return (
    <>
      <div>
        <span>Last result:</span>
        <ul>
          {books.map(bs => (
            <li key={bs.isbn}>
              {statusIcon(bs.status)} {bs.isbn}:{' '}
              {bs.data ? `${bs.data.title} by ${bs.data.authors[0]}` : null}
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={scannerRef}
        style={{ position: 'relative', border: '3px solid red' }}
      >
        <canvas
          className="drawingBuffer"
          style={{
            position: 'absolute',
            top: '0px',
            // left: '0px',
            // height: '100%',
            width: '100%',
            border: '3px solid green',
          }}
          width="1920"
          height="1200"
        />

        <Scanner
          scannerRef={scannerRef}
          onDetected={result => importBook(result)}
          constraints={{
            width: 1920,
            height: 1200,
          }}
          facingMode="user"
        />
      </div>{' '}
    </>
  )
}
