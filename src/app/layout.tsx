import 'react-toastify/dist/ReactToastify.css'
import '../../styles/globals.css'
import { GoogleAnalyticsTag } from '@/utils/analytics/GoogleAnalyticsTag'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>{children}</body>
      <GoogleAnalyticsTag />
    </html>
  )
}
