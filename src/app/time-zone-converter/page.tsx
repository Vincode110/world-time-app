'use client'

import { TimeZoneConverter } from '@/components/time-zone-converter'
import { MegaNavigation } from '@/components/mega-navigation'
import Script from 'next/script'

export default function TimeZoneConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Script id="ld-json-timezone-converter" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Time Zone Converter',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            description: 'Convert date and time across world time zones with DST handled automatically. Select by city or IANA time zone.',
            url: '/time-zone-converter',
            featureList: [
              'DST-aware conversions',
              'Select by city or IANA zone',
              'Custom date and time input',
              'Shareable conversions',
            ],
            offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
            about: {
              '@type': 'Thing',
              name: 'Time zones',
            },
            potentialAction: {
              '@type': 'Action',
              name: 'Convert time',
              target: '/time-zone-converter',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Time Tools',
              logo: { '@type': 'ImageObject', url: '/logo.svg' },
            },
            isAccessibleForFree: true,
          }),
        }}
      />
      <MegaNavigation />
      <div className="container mx-auto px-4 py-8">
        <TimeZoneConverter />
      </div>
    </div>
  )
}