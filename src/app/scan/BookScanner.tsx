'use client'

import { useRef } from 'react'
import { BarcodeFormat } from '@zxing/library'
import {
  BookImportState,
  useBookImporter,
} from '@/books/importer/useBookImporter'
import Scanner from '@/barcodes/Scanner'

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
  const scannerRef = useRef(null)

  return (
    <>
      <div ref={scannerRef} style={{ border: '1px solid red' }}>
        <Scanner
          scannerRef={scannerRef}
          onDetected={result => importBook(result)}
          constraints={{
            width: 1920,
            height: 1920,
          }}
          locator={{
            patchSize: 'small',
            halfSample: true,
          }}
          facingMode="environment"
        />
      </div>
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
    </>
  )
}
