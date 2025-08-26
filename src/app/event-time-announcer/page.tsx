'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MegaNavigation } from '@/components/mega-navigation'
import { Calendar, Clock, Users } from 'lucide-react'

export default function EventTimeAnnouncerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <MegaNavigation />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Time Announcer
            </CardTitle>
            <CardDescription>
              Share event times across different time zones with participants worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Event Time Announcer</h3>
              <p className="text-gray-600 mb-6">
                Schedule events and share the correct times with participants in different time zones.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-purple-800">
                  <strong>Note:</strong> Event scheduling and time zone conversion features will be implemented with proper backend integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}