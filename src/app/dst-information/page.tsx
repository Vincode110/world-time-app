'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MegaNavigation } from '@/components/mega-navigation'
import { Clock, Info } from 'lucide-react'

export default function DSTInformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <MegaNavigation />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daylight Saving Time Information
            </CardTitle>
            <CardDescription>
              Learn about DST changes and how they affect time zones worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Info className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">DST Information Center</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive information about Daylight Saving Time changes, dates, and affected regions.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> Detailed DST information and historical data will be implemented with proper API integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}