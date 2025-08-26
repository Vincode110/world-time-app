'use client'

import { TimeZoneMap } from '@/components/time-zone-map'
import { MegaNavigation } from '@/components/mega-navigation'

export default function TimeZoneMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <MegaNavigation />
      <div className="container mx-auto px-4 py-8">
        <TimeZoneMap />
      </div>
    </div>
  )
}