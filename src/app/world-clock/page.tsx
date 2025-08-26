'use client'

import { WorldClock } from '@/components/world-clock'
import { MegaNavigation } from '@/components/mega-navigation'
import Script from 'next/script'

export default function WorldClockPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Script id="ld-json-world-clock" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'World Clock',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            description: 'Live local times, offsets, and DST status for cities worldwide. Save your cities for quick access.',
            url: '/world-clock',
            featureList: [
              'Real-time city clocks',
              'DST-aware offsets',
              'Favorites (My Cities)',
            ],
            offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
            isAccessibleForFree: true,
          }),
        }}
      />
      <MegaNavigation />
      <div className="container mx-auto px-4 py-8">
        <WorldClock />
      </div>
    </div>
  )
}