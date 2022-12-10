'use client'

import BookScanner from './BookScanner'
import { useClientOnly } from '@/utils/hooks/useClientOnly'

export default function ScanPage() {
  // Force load only on client, hack hack, use client not enough?!
  const onClient = useClientOnly()

  return <div>{onClient && <BookScanner />}</div>
}
