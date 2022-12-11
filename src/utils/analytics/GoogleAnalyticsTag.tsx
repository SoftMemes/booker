import Script from 'next/script'

export const GoogleAnalyticsTag = () => (
  <>
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-E3D4JHSZ3R"
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-E3D4JHSZ3R');`}
    </Script>
  </>
)
