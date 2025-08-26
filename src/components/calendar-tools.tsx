'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Star, MapPin, Gift } from 'lucide-react'

interface Holiday {
  date: string
  name: string
  type: 'national' | 'religious' | 'observance'
  country: string
}

const holidays: Holiday[] = [
  // US Holidays 2024
  { date: '2024-01-01', name: "New Year's Day", type: 'national', country: 'US' },
  { date: '2024-01-15', name: "Martin Luther King Jr. Day", type: 'national', country: 'US' },
  { date: '2024-02-14', name: "Valentine's Day", type: 'observance', country: 'US' },
  { date: '2024-02-19', name: "Presidents' Day", type: 'national', country: 'US' },
  { date: '2024-03-17', name: "St. Patrick's Day", type: 'observance', country: 'US' },
  { date: '2024-03-31', name: "Easter Sunday", type: 'religious', country: 'US' },
  { date: '2024-05-27', name: "Memorial Day", type: 'national', country: 'US' },
  { date: '2024-06-19', name: "Juneteenth", type: 'national', country: 'US' },
  { date: '2024-07-04', name: "Independence Day", type: 'national', country: 'US' },
  { date: '2024-09-02', name: "Labor Day", type: 'national', country: 'US' },
  { date: '2024-10-14', name: "Columbus Day", type: 'national', country: 'US' },
  { date: '2024-10-31', name: "Halloween", type: 'observance', country: 'US' },
  { date: '2024-11-11', name: "Veterans Day", type: 'national', country: 'US' },
  { date: '2024-11-28', name: "Thanksgiving Day", type: 'national', country: 'US' },
  { date: '2024-12-25', name: "Christmas Day", type: 'national', country: 'US' },
  { date: '2024-12-31', name: "New Year's Eve", type: 'observance', country: 'US' },
  
  // UK Holidays 2024
  { date: '2024-01-01', name: "New Year's Day", type: 'national', country: 'UK' },
  { date: '2024-03-29', name: "Good Friday", type: 'religious', country: 'UK' },
  { date: '2024-04-01', name: "Easter Monday", type: 'religious', country: 'UK' },
  { date: '2024-05-06', name: "Early May Bank Holiday", type: 'national', country: 'UK' },
  { date: '2024-05-27', name: "Spring Bank Holiday", type: 'national', country: 'UK' },
  { date: '2024-08-26', name: "Summer Bank Holiday", type: 'national', country: 'UK' },
  { date: '2024-12-25', name: "Christmas Day", type: 'national', country: 'UK' },
  { date: '2024-12-26', name: "Boxing Day", type: 'national', country: 'UK' },
  
  // Canada Holidays 2024
  { date: '2024-01-01', name: "New Year's Day", type: 'national', country: 'Canada' },
  { date: '2024-02-19', name: "Family Day", type: 'national', country: 'Canada' },
  { date: '2024-03-29', name: "Good Friday", type: 'religious', country: 'Canada' },
  { date: '2024-05-20', name: "Victoria Day", type: 'national', country: 'Canada' },
  { date: '2024-07-01', name: "Canada Day", type: 'national', country: 'Canada' },
  { date: '2024-09-02', name: "Labour Day", type: 'national', country: 'Canada' },
  { date: '2024-10-14', name: "Thanksgiving", type: 'national', country: 'Canada' },
  { date: '2024-11-11', name: "Remembrance Day", type: 'national', country: 'Canada' },
  { date: '2024-12-25', name: "Christmas Day", type: 'national', country: 'Canada' },
  
  // Australia Holidays 2024
  { date: '2024-01-01', name: "New Year's Day", type: 'national', country: 'Australia' },
  { date: '2024-01-26', name: "Australia Day", type: 'national', country: 'Australia' },
  { date: '2024-03-29', name: "Good Friday", type: 'religious', country: 'Australia' },
  { date: '2024-04-01', name: "Easter Monday", type: 'religious', country: 'Australia' },
  { date: '2024-04-25', name: "ANZAC Day", type: 'national', country: 'Australia' },
  { date: '2024-12-25', name: "Christmas Day", type: 'national', country: 'Australia' },
  { date: '2024-12-26', name: "Boxing Day", type: 'national', country: 'Australia' }
]

const countries = [
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'Germany', label: 'Germany', flag: '🇩🇪' },
  { value: 'France', label: 'France', flag: '🇫🇷' },
  { value: 'Japan', label: 'Japan', flag: '🇯🇵' },
  { value: 'India', label: 'India', flag: '🇮🇳' }
]

export function CalendarTools() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedCountry, setSelectedCountry] = useState('US')
  const [calendarType, setCalendarType] = useState<'month' | 'year'>('month')
  const [showHolidays, setShowHolidays] = useState(true)
  const [showWeekNumbers, setShowWeekNumbers] = useState(false)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  const getHolidaysForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return holidays.filter(holiday => 
      holiday.date === dateStr && holiday.country === selectedCountry
    )
  }

  const getHolidaysForMonth = (year: number, month: number) => {
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date)
      return holidayDate.getFullYear() === year && 
             holidayDate.getMonth() === month && 
             holiday.country === selectedCountry
    })
  }

  const getHolidaysForYear = (year: number) => {
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date)
      return holidayDate.getFullYear() === year && holiday.country === selectedCountry
    })
  }

  const generateMonthCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
    const calendar = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day)
    }
    
    return calendar
  }

  const generateYearCalendar = () => {
    const year = []
    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(selectedYear, month)
      const firstDay = getFirstDayOfMonth(selectedYear, month)
      const monthCalendar = []
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        monthCalendar.push(null)
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        monthCalendar.push(day)
      }
      
      year.push(monthCalendar)
    }
    
    return year
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    setSelectedYear(selectedYear + (direction === 'prev' ? -1 : 1))
  }

  const goToToday = () => {
    const today = new Date()
    setSelectedYear(today.getFullYear())
    setSelectedMonth(today.getMonth())
    setCurrentDate(today)
  }

  const downloadCalendar = () => {
    const content = generateCalendarText()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calendar-${selectedYear}-${selectedMonth + 1}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateCalendarText = () => {
    if (calendarType === 'month') {
      const monthHolidays = getHolidaysForMonth(selectedYear, selectedMonth)
      let content = `${monthNames[selectedMonth]} ${selectedYear}\n`
      content += '='.repeat(content.length) + '\n\n'
      
      content += dayNames.join(' ') + '\n'
      const calendar = generateMonthCalendar()
      
      for (let i = 0; i < calendar.length; i += 7) {
        const week = calendar.slice(i, i + 7)
        const weekStr = week.map(day => day ? day.toString().padStart(2) : '  ').join(' ')
        content += weekStr + '\n'
      }
      
      if (monthHolidays.length > 0) {
        content += '\nHolidays:\n'
        monthHolidays.forEach(holiday => {
          content += `- ${holiday.name}\n`
        })
      }
      
      return content
    } else {
      let content = `${selectedYear} Calendar\n`
      content += '='.repeat(content.length) + '\n\n'
      
      const yearHolidays = getHolidaysForYear(selectedYear)
      if (yearHolidays.length > 0) {
        content += 'Holidays:\n'
        yearHolidays.forEach(holiday => {
          const date = new Date(holiday.date)
          content += `- ${date.toLocaleDateString()} - ${holiday.name}\n`
        })
      }
      
      return content
    }
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           selectedMonth === today.getMonth() && 
           selectedYear === today.getFullYear()
  }

  const getHolidayBadge = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day)
    const dayHolidays = getHolidaysForDate(date)
    
    if (dayHolidays.length === 0) return null
    
    const mainHoliday = dayHolidays[0]
    const colorClass = mainHoliday.type === 'national' ? 'bg-red-100 text-red-800' :
                      mainHoliday.type === 'religious' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
    
    return (
      <Badge className={`text-xs ${colorClass}`}>
        {mainHoliday.name}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar Tools
          </CardTitle>
          <CardDescription>
            View and create custom calendars with holidays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendarType === 'month' ? navigateMonth('prev') : navigateYear('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {calendarType === 'month' 
                  ? `${monthNames[selectedMonth]} ${selectedYear}`
                  : `${selectedYear}`
                }
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendarType === 'month' ? navigateMonth('next') : navigateYear('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Tabs value={calendarType} onValueChange={(value: 'month' | 'year') => setCalendarType(value)}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" onClick={downloadCalendar}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showHolidays}
                onChange={(e) => setShowHolidays(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Holidays</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showWeekNumbers}
                onChange={(e) => setShowWeekNumbers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Week Numbers</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Display */}
      {calendarType === 'month' ? (
        <Card>
          <CardHeader>
            <CardTitle>{monthNames[selectedMonth]} {selectedYear}</CardTitle>
            <CardDescription>
              {countries.find(c => c.value === selectedCountry)?.label} Calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {showWeekNumbers && (
                <div className="text-center text-xs font-medium text-gray-500 p-2">Wk</div>
              )}
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              
              {generateMonthCalendar().map((day, index) => {
                const weekIndex = Math.floor((index + (showWeekNumbers ? 1 : 0)) / 7)
                const dayIndex = index % 7
                
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="p-2"></div>
                  )
                }
                
                const date = new Date(selectedYear, selectedMonth, day)
                const weekNumber = getWeekNumber(date)
                const holidays = getHolidaysForDate(date)
                
                return (
                  <div key={day} className="min-h-[80px] p-1 border border-gray-100">
                    {showWeekNumbers && dayIndex === 0 && (
                      <div className="text-xs text-gray-400 text-center mb-1">
                        {weekNumber}
                      </div>
                    )}
                    <div className={`text-sm font-medium p-1 rounded ${
                      isToday(day) ? 'bg-blue-500 text-white' : ''
                    }`}>
                      {day}
                    </div>
                    {showHolidays && holidays.length > 0 && (
                      <div className="mt-1">
                        {getHolidayBadge(day)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedYear} Calendar</CardTitle>
            <CardDescription>
              {countries.find(c => c.value === selectedCountry)?.label} Year View
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {generateYearCalendar().map((monthCalendar, monthIndex) => (
                <Card key={monthIndex} className="text-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{monthNames[monthIndex]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {dayNames.map(day => (
                        <div key={day} className="text-center font-medium text-gray-500 p-1">
                          {day[0]}
                        </div>
                      ))}
                      
                      {monthCalendar.map((day, dayIndex) => {
                        if (day === null) {
                          return <div key={`empty-${dayIndex}`} className="p-1"></div>
                        }
                        
                        const date = new Date(selectedYear, monthIndex, day)
                        const holidays = getHolidaysForDate(date)
                        const isCurrentMonth = monthIndex === new Date().getMonth() && 
                                             selectedYear === new Date().getFullYear()
                        
                        return (
                          <div key={day} className="p-1">
                            <div className={`text-center p-1 rounded ${
                              isToday(day) && isCurrentMonth ? 'bg-blue-500 text-white' :
                              holidays.length > 0 ? 'bg-red-50' : ''
                            }`}>
                              {day}
                            </div>
                            {showHolidays && holidays.length > 0 && (
                              <div className="w-1 h-1 bg-red-500 rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Holidays List */}
      {showHolidays && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Holidays for {calendarType === 'month' ? monthNames[selectedMonth] : ''} {selectedYear}
            </CardTitle>
            <CardDescription>
              {countries.find(c => c.value === selectedCountry)?.label} Holidays and Observances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calendarType === 'month' ? (
              <div className="space-y-2">
                {getHolidaysForMonth(selectedYear, selectedMonth).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No holidays this month</p>
                ) : (
                  getHolidaysForMonth(selectedYear, selectedMonth)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((holiday, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            holiday.type === 'national' ? 'bg-red-500' :
                            holiday.type === 'religious' ? 'bg-purple-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{holiday.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(holiday.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          holiday.type === 'national' ? 'destructive' :
                          holiday.type === 'religious' ? 'secondary' :
                          'default'
                        }>
                          {holiday.type}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {getHolidaysForYear(selectedYear).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No holidays this year</p>
                ) : (
                  getHolidaysForYear(selectedYear)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((holiday, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            holiday.type === 'national' ? 'bg-red-500' :
                            holiday.type === 'religious' ? 'bg-purple-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{holiday.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(holiday.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          holiday.type === 'national' ? 'destructive' :
                          holiday.type === 'religious' ? 'secondary' :
                          'default'
                        }>
                          {holiday.type}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Calendar Options */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Options</CardTitle>
          <CardDescription>
            Customize your calendar view and export options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <div className="font-semibold mb-1">Printable PDF</div>
                <div className="text-sm text-gray-600">Generate and print calendar as PDF</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <div className="font-semibold mb-1">Custom Calendar</div>
                <div className="text-sm text-gray-600">Create personalized calendar with events</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <div className="font-semibold mb-1">Share Calendar</div>
                <div className="text-sm text-gray-600">Export and share with others</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}