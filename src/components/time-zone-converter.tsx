'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Globe, Calendar, ArrowRightLeft } from 'lucide-react'
import { getTimeZones } from '@vvo/tzdb'
import { convertTime } from '@/lib/timezone'

const allZones = (getTimeZones() as any[]).map((z) => ({
  value: z.name,
  label: z.name,
  country: (z.countries && z.countries[0]) || '',
  cities: z.group || [],
}))

export function TimeZoneConverter() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [fromTimezone, setFromTimezone] = useState('UTC')
  const [toTimezone, setToTimezone] = useState('America/New_York')
  const [convertedTime, setConvertedTime] = useState('')
  const [convertedDate, setConvertedDate] = useState('')
  const [timeDifference, setTimeDifference] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [customDate, setCustomDate] = useState('')
  const [conversionHistory, setConversionHistory] = useState<any[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    convertTime()
  }, [fromTimezone, toTimezone, customTime, customDate])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const convertTime = () => {
    const iso = (customTime && customDate) ? `${customDate}T${customTime}` : undefined
    try {
      const res = convertTimeLib(fromTimezone, toTimezone, iso)
      setConvertedTime(res.targetTime)
      setConvertedDate(res.targetDate)
      setTimeDifference(res.diffLabel)
      setConversionHistory(prev => [res.historyEntry, ...prev.slice(0, 9)])
    } catch {}
  }

  function convertTimeLib(from: string, to: string, iso?: string) {
    const result = convertTime(from, to, iso ? { iso } : {})
    const diffMin = result.timeDifferenceMinutes
    const hours = Math.trunc(Math.abs(diffMin) / 60)
    const minutes = Math.abs(diffMin) % 60
    const sign = diffMin >= 0 ? '+' : '-'
    const diffLabel = minutes === 0 ? `${sign}${hours} hours` : `${sign}${hours}h ${minutes}m`

    const sourceDate = new Date(result.sourceISO)
    const targetDate = new Date(result.targetISO)

    return {
      targetTime: targetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      targetDate: targetDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      diffLabel,
      historyEntry: {
        from: from,
        to: to,
        fromTime: sourceDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        toTime: targetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        fromDate: sourceDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        toDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        difference: diffLabel,
        timestamp: new Date().toISOString(),
      },
    }
  }

  const swapTimezones = () => {
    setFromTimezone(toTimezone)
    setToTimezone(fromTimezone)
  }

  const useCurrentTime = () => {
    setCustomTime('')
    setCustomDate('')
  }

  const getFromTZ = allZones.find(tz => tz.value === fromTimezone)
  const getToTZ = allZones.find(tz => tz.value === toTimezone)

  return (
    <div className="space-y-6">
      {/* Main Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Time Zone Converter
          </CardTitle>
          <CardDescription>
            Convert time between different time zones around the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Time</TabsTrigger>
              <TabsTrigger value="custom">Custom Date & Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Current Local Time</div>
                <div className="text-2xl font-mono font-bold text-blue-900">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-blue-700">
                  {formatDate(currentTime)}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    step="1"
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={useCurrentTime}
                className="w-full"
              >
                Use Current Time Instead
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            {/* From Timezone */}
            <div>
              <label className="block text-sm font-medium mb-2">From Time Zone</label>
              <Select value={fromTimezone} onValueChange={setFromTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {allZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <div>
                        <div className="font-medium">{tz.label}</div>
                        <div className="text-xs text-gray-500">{tz.country}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={swapTimezones} className="rounded-full">
                ⇄
              </Button>
            </div>

            {/* To Timezone */}
            <div>
              <label className="block text-sm font-medium mb-2">To Time Zone</label>
              <Select value={toTimezone} onValueChange={setToTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {allZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <div>
                        <div className="font-medium">{tz.label}</div>
                        <div className="text-xs text-gray-500">{tz.country}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Result */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Converted Time</div>
                <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                  {convertedTime}
                </div>
                <div className="text-lg text-gray-700 mb-3">
                  {convertedDate}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary">
                    {getFromTZ?.label} → {getToTZ?.label}
                  </Badge>
                  <Badge variant="outline">
                    {timeDifference}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>
            Common time zone conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'America/New_York', to: 'Europe/London', label: 'New York → London' },
              { from: 'Europe/London', to: 'Europe/Paris', label: 'London → Paris' },
              { from: 'America/Los_Angeles', to: 'America/New_York', label: 'Los Angeles → New York' },
              { from: 'Asia/Tokyo', to: 'America/New_York', label: 'Tokyo → New York' },
              { from: 'Australia/Sydney', to: 'Europe/London', label: 'Sydney → London' },
              { from: 'Asia/Kolkata', to: 'Europe/London', label: 'Mumbai → London' }
            ].map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => {
                  setFromTimezone(item.from)
                  setToTimezone(item.to)
                }}
              >
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.from} → {item.to}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion History */}
      {conversionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>
              Your recent time zone conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversionHistory.map((conversion, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {conversion.fromTime} → {conversion.toTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      {conversion.from.split(' ')[0]} → {conversion.to.split(' ')[0]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{conversion.difference}</div>
                    <div className="text-xs text-gray-400">{conversion.fromDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}