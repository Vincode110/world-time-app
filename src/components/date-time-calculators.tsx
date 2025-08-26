'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Calculator, Clock, Plus, Minus, Timer, TrendingUp } from 'lucide-react'

interface DateDurationResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  weeks: number
  weekdays: number
  weekends: number
}

export function DateTimeCalculators() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('duration')

  // Date Duration Calculator State
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [durationResult, setDurationResult] = useState<DateDurationResult | null>(null)
  const [includeEndTime, setIncludeEndTime] = useState(true)

  // Add/Subtract Calculator State
  const [baseDate, setBaseDate] = useState('')
  const [addSubtractType, setAddSubtractType] = useState<'add' | 'subtract'>('add')
  const [years, setYears] = useState('0')
  const [months, setMonths] = useState('0')
  const [weeks, setWeeks] = useState('0')
  const [days, setDays] = useState('0')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('0')
  const [seconds, setSeconds] = useState('0')
  const [addSubtractResult, setAddSubtractResult] = useState('')

  // Time Duration Calculator State
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [timeDurationResult, setTimeDurationResult] = useState('')

  // Business Date Calculator State
  const [businessStartDate, setBusinessStartDate] = useState('')
  const [businessDays, setBusinessDays] = useState('0')
  const [businessResult, setBusinessResult] = useState('')
  const [excludeHolidays, setExcludeHolidays] = useState(false)
  const [excludeWeekends, setExcludeWeekends] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set default dates
    const today = new Date()
    const nextWeek = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
    
    setStartDate(today.toISOString().split('T')[0])
    setEndDate(nextWeek.toISOString().split('T')[0])
    setBaseDate(today.toISOString().split('T')[0])
    setBusinessStartDate(today.toISOString().split('T')[0])
    
    // Set default date-times
    const now = new Date()
    const later = new Date(now.getTime() + (2 * 60 * 60 * 1000)) // 2 hours later
    setStartDateTime(now.toISOString().slice(0, 16))
    setEndDateTime(later.toISOString().slice(0, 16))
  }, [])

  // Date Duration Calculator
  const calculateDateDuration = () => {
    if (!startDate || !endDate) return

    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (includeEndTime) {
      end.setHours(23, 59, 59, 999)
    }

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()
    
    if (days < 0) {
      months--
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
      days += lastMonth.getDate()
    }
    
    if (months < 0) {
      years--
      months += 12
    }

    // Calculate totals
    const totalWeeks = Math.floor(diffDays / 7)
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60))
    const totalMinutes = Math.floor(diffTime / (1000 * 60))
    const totalSeconds = Math.floor(diffTime / 1000)
    
    // Calculate weekdays and weekends
    let weekdays = 0
    let weekends = 0
    const currentDate = new Date(start)
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++
      } else {
        weekdays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setDurationResult({
      years,
      months,
      days,
      totalDays: diffDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      weeks: totalWeeks,
      weekdays,
      weekends
    })
  }

  // Add/Subtract Calculator
  const calculateAddSubtract = () => {
    if (!baseDate) return

    const date = new Date(baseDate)
    const multiplier = addSubtractType === 'add' ? 1 : -1

    date.setFullYear(date.getFullYear() + (parseInt(years) || 0) * multiplier)
    date.setMonth(date.getMonth() + (parseInt(months) || 0) * multiplier)
    date.setDate(date.getDate() + (parseInt(weeks) || 0) * 7 * multiplier)
    date.setDate(date.getDate() + (parseInt(days) || 0) * multiplier)
    date.setHours(date.getHours() + (parseInt(hours) || 0) * multiplier)
    date.setMinutes(date.getMinutes() + (parseInt(minutes) || 0) * multiplier)
    date.setSeconds(date.getSeconds() + (parseInt(seconds) || 0) * multiplier)

    setAddSubtractResult(date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
  }

  // Time Duration Calculator
  const calculateTimeDuration = () => {
    if (!startDateTime || !endDateTime) return

    const start = new Date(startDateTime)
    const end = new Date(endDateTime)
    
    if (end <= start) {
      setTimeDurationResult('End time must be after start time')
      return
    }

    const diffTime = end.getTime() - start.getTime()
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)

    let result = ''
    if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `
    if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `
    if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''} `
    if (seconds > 0) result += `${seconds} second${seconds > 1 ? 's' : ''}`
    
    if (result === '') result = '0 seconds'

    setTimeDurationResult(result.trim())
  }

  // Business Date Calculator
  const calculateBusinessDate = () => {
    if (!businessStartDate || !businessDays) return

    const startDate = new Date(businessStartDate)
    const daysToAdd = parseInt(businessDays)
    let currentDate = new Date(startDate)
    let businessDaysCounted = 0

    while (businessDaysCounted < Math.abs(daysToAdd)) {
      currentDate.setDate(currentDate.getDate() + 1)
      
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
      const isHoliday = false // Simplified - in real app, check against holiday database
      
      if (!excludeWeekends || !isWeekend) {
        if (!excludeHolidays || !isHoliday) {
          businessDaysCounted++
        }
      }
    }

    setBusinessResult(currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Calculator Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Date & Time Calculators
          </CardTitle>
          <CardDescription>
            Comprehensive suite of date and time calculation tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="duration">Duration</TabsTrigger>
              <TabsTrigger value="add-subtract">Add/Subtract</TabsTrigger>
              <TabsTrigger value="time-duration">Time Duration</TabsTrigger>
              <TabsTrigger value="business">Business Date</TabsTrigger>
            </TabsList>

            {/* Date Duration Calculator */}
            <TabsContent value="duration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeEndTime"
                  checked={includeEndTime}
                  onChange={(e) => setIncludeEndTime(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="includeEndTime" className="text-sm">
                  Include end time (23:59:59)
                </label>
              </div>
              
              <Button onClick={calculateDateDuration} className="w-full">
                Calculate Duration
              </Button>

              {durationResult && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Duration Result</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{durationResult.years}</div>
                      <div className="text-sm text-gray-600">Years</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{durationResult.months}</div>
                      <div className="text-sm text-gray-600">Months</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{durationResult.days}</div>
                      <div className="text-sm text-gray-600">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{durationResult.totalDays}</div>
                      <div className="text-sm text-gray-600">Total Days</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium">Weeks</div>
                      <div className="text-lg">{durationResult.totalWeeks}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium">Weekdays</div>
                      <div className="text-lg">{durationResult.weekdays}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium">Weekends</div>
                      <div className="text-lg">{durationResult.weekends}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium">Hours</div>
                      <div className="text-lg">{durationResult.totalHours.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium">Minutes</div>
                      <div className="text-lg">{durationResult.totalMinutes.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium">Seconds</div>
                      <div className="text-lg">{durationResult.totalSeconds.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Add/Subtract Calculator */}
            <TabsContent value="add-subtract" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Base Date</label>
                <Input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant={addSubtractType === 'add' ? 'default' : 'outline'}
                  onClick={() => setAddSubtractType('add')}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button
                  variant={addSubtractType === 'subtract' ? 'default' : 'outline'}
                  onClick={() => setAddSubtractType('subtract')}
                  size="sm"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Subtract
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Years</label>
                  <Input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Months</label>
                  <Input
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weeks</label>
                  <Input
                    type="number"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Days</label>
                  <Input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hours</label>
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Minutes</label>
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Seconds</label>
                  <Input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <Button onClick={calculateAddSubtract} className="w-full">
                {addSubtractType === 'add' ? 'Add to Date' : 'Subtract from Date'}
              </Button>

              {addSubtractResult && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-2">Result</h3>
                  <div className="text-xl font-mono text-gray-900">
                    {addSubtractResult}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Time Duration Calculator */}
            <TabsContent value="time-duration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={calculateTimeDuration} className="w-full">
                Calculate Time Duration
              </Button>

              {timeDurationResult && (
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-2">Time Duration</h3>
                  <div className="text-2xl font-bold text-purple-900">
                    {timeDurationResult}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Business Date Calculator */}
            <TabsContent value="business" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={businessStartDate}
                    onChange={(e) => setBusinessStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Days</label>
                  <Input
                    type="number"
                    value={businessDays}
                    onChange={(e) => setBusinessDays(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={excludeWeekends}
                    onChange={(e) => setExcludeWeekends(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Exclude weekends (Saturday & Sunday)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={excludeHolidays}
                    onChange={(e) => setExcludeHolidays(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Exclude holidays</span>
                </label>
              </div>

              <Button onClick={calculateBusinessDate} className="w-full">
                Calculate Business Date
              </Button>

              {businessResult && (
                <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-2">Business Date Result</h3>
                  <div className="text-xl font-mono text-gray-900">
                    {businessResult}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Calculators */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Calculators</CardTitle>
          <CardDescription>
            Common date and time calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left" onClick={() => {
              setActiveTab('duration')
              const today = new Date()
              const future = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
              setStartDate(today.toISOString().split('T')[0])
              setEndDate(future.toISOString().split('T')[0])
            }}>
              <div>
                <div className="font-semibold mb-1">30 Days from Now</div>
                <div className="text-sm text-gray-600">Calculate duration for next 30 days</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left" onClick={() => {
              setActiveTab('add-subtract')
              setBaseDate(new Date().toISOString().split('T')[0])
              setYears('1')
              setMonths('0')
              setDays('0')
              setAddSubtractType('add')
            }}>
              <div>
                <div className="font-semibold mb-1">Add 1 Year</div>
                <div className="text-sm text-gray-600">Add one year to current date</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left" onClick={() => {
              setActiveTab('business')
              setBusinessStartDate(new Date().toISOString().split('T')[0])
              setBusinessDays('5')
            }}>
              <div>
                <div className="font-semibold mb-1">5 Business Days</div>
                <div className="text-sm text-gray-600">Calculate date 5 business days from now</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Information */}
      <Card>
        <CardHeader>
          <CardTitle>Calculator Information</CardTitle>
          <CardDescription>
            How to use these calculators effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Duration
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Calculate the exact duration between two dates, including years, months, days, and total time units.
              </p>
              
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add/Subtract Dates
              </h4>
              <p className="text-sm text-gray-600">
                Add or subtract years, months, weeks, days, hours, minutes, or seconds from any date.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Duration
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Calculate precise time differences between two specific dates and times.
              </p>
              
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Business Date
              </h4>
              <p className="text-sm text-gray-600">
                Calculate future or past business dates, excluding weekends and optionally holidays.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}