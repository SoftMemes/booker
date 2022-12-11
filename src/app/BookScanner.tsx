'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BookImportState,
  useBookImporter,
} from '@/books/importer/useBookImporter'
import Scanner from './components/barcodes/Scanner'

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
  // HACK HACK HACK - Production builds fail to load Quagga due to some randomness, this forces the DOM stuff to load
  // fully before starting to initialize media streams and other fun
  const [hack, setHack] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setHack(true)
    }, 500)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={scannerRef}>
        {hack && (
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
        )}
      </div>
      <div>
        <ul>
          {books.map(bs => (
            <li key={bs.isbn}>
              {statusIcon(bs.status)} {bs.isbn}:{' '}
              {bs.data ? `${bs.data.title} by ${bs.data.authors[0]}` : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
