import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { GoogleAnalyticsTag } from '@/utils/analytics/GoogleAnalyticsTag'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
      <GoogleAnalyticsTag />
    </SessionProvider>
  )
}
