'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Clock, Globe, Plus, X, Calendar, Video, Phone, Mail } from 'lucide-react'

interface MeetingLocation {
  id: string
  name: string
  timezone: string
  offset: number
  country: string
  color: string
}

interface MeetingTime {
  hour: number
  minute: number
  isBusinessHours: boolean[]
  timeStrings: string[]
  dateStrings: string[]
}

const popularLocations: MeetingLocation[] = [
  { id: '1', name: 'New York', timezone: 'America/New_York', offset: -4, country: 'USA', color: 'bg-blue-500' },
  { id: '2', name: 'London', timezone: 'Europe/London', offset: 1, country: 'UK', color: 'bg-green-500' },
  { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9, country: 'Japan', color: 'bg-red-500' },
  { id: '4', name: 'Sydney', timezone: 'Australia/Sydney', offset: 11, country: 'Australia', color: 'bg-purple-500' },
  { id: '5', name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -7, country: 'USA', color: 'bg-orange-500' },
  { id: '6', name: 'Paris', timezone: 'Europe/Paris', offset: 2, country: 'France', color: 'bg-pink-500' },
  { id: '7', name: 'Dubai', timezone: 'Asia/Dubai', offset: 4, country: 'UAE', color: 'bg-cyan-500' },
  { id: '8', name: 'Singapore', timezone: 'Asia/Singapore', offset: 8, country: 'Singapore', color: 'bg-indigo-500' }
]

const timeZones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 0 },
  { value: 'EST', label: 'EST (Eastern Standard Time)', offset: -5 },
  { value: 'EDT', label: 'EDT (Eastern Daylight Time)', offset: -4 },
  { value: 'CST', label: 'CST (Central Standard Time)', offset: -6 },
  { value: 'CDT', label: 'CDT (Central Daylight Time)', offset: -5 },
  { value: 'MST', label: 'MST (Mountain Standard Time)', offset: -7 },
  { value: 'MDT', label: 'MDT (Mountain Daylight Time)', offset: -6 },
  { value: 'PST', label: 'PST (Pacific Standard Time)', offset: -8 },
  { value: 'PDT', label: 'PDT (Pacific Daylight Time)', offset: -7 },
  { value: 'GMT', label: 'GMT (Greenwich Mean Time)', offset: 0 },
  { value: 'CET', label: 'CET (Central European Time)', offset: 1 },
  { value: 'CEST', label: 'CEST (Central European Summer Time)', offset: 2 },
  { value: 'EET', label: 'EET (Eastern European Time)', offset: 2 },
  { value: 'EEST', label: 'EEST (Eastern European Summer Time)', offset: 3 },
  { value: 'IST', label: 'IST (India Standard Time)', offset: 5.5 },
  { value: 'CST_CHINA', label: 'CST (China Standard Time)', offset: 8 },
  { value: 'JST', label: 'JST (Japan Standard Time)', offset: 9 },
  { value: 'KST', label: 'KST (Korea Standard Time)', offset: 9 },
  { value: 'SGT', label: 'SGT (Singapore Time)', offset: 8 },
  { value: 'AEST', label: 'AEST (Australian Eastern Standard Time)', offset: 10 },
  { value: 'AEDT', label: 'AEDT (Australian Eastern Daylight Time)', offset: 11 },
  { value: 'NZST', label: 'NZST (New Zealand Standard Time)', offset: 12 }
]

export function MeetingPlanner() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('09:00')
  const [meetingDuration, setMeetingDuration] = useState(60)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingLocations, setMeetingLocations] = useState<MeetingLocation[]>(popularLocations.slice(0, 3))
  const [meetingResults, setMeetingResults] = useState<any[]>([])
  const [bestTimes, setBestTimes] = useState<MeetingTime[]>([])
  const [activeTab, setActiveTab] = useState('planner')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setMeetingDate(tomorrow.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (meetingDate && meetingTime && meetingLocations.length > 0) {
      calculateMeetingTimes()
      findBestMeetingTimes()
    }
  }, [meetingDate, meetingTime, meetingLocations, meetingDuration])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateMeetingTimes = () => {
    const [hours, minutes] = meetingTime.split(':').map(Number)
    const baseDate = new Date(meetingDate)
    baseDate.setHours(hours, minutes, 0, 0)
    
    const results = meetingLocations.map(location => {
      const utcTime = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000)
      const localTime = new Date(utcTime + (location.offset * 3600000))
      const endTime = new Date(localTime.getTime() + (meetingDuration * 60000))
      
      return {
        ...location,
        localTime: formatTime(localTime),
        localEndTime: formatTime(endTime),
        localDate: formatDate(localTime),
        isBusinessHours: localTime.getHours() >= 9 && localTime.getHours() <= 17,
        isEndBusinessHours: endTime.getHours() >= 9 && endTime.getHours() <= 17,
        timestamp: localTime.getTime()
      }
    })
    
    setMeetingResults(results)
  }

  const findBestMeetingTimes = () => {
    const times: MeetingTime[] = []
    
    // Check each hour from 6 AM to 10 PM
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const businessHours: boolean[] = []
        const timeStrings: string[] = []
        const dateStrings: string[] = []
        
        meetingLocations.forEach(location => {
          const baseDate = new Date(meetingDate)
          baseDate.setHours(hour, minute, 0, 0)
          
          const utcTime = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000)
          const localTime = new Date(utcTime + (location.offset * 3600000))
          const endTime = new Date(localTime.getTime() + (meetingDuration * 60000))
          
          businessHours.push(
            localTime.getHours() >= 9 && localTime.getHours() <= 17 &&
            endTime.getHours() >= 9 && endTime.getHours() <= 17
          )
          timeStrings.push(formatTime(localTime))
          dateStrings.push(formatDate(localTime))
        })
        
        const allBusinessHours = businessHours.every(hours => hours)
        const someBusinessHours = businessHours.some(hours => hours)
        
        if (allBusinessHours || someBusinessHours) {
          times.push({
            hour,
            minute,
            isBusinessHours: businessHours,
            timeStrings,
            dateStrings
          })
        }
      }
    }
    
    // Sort by number of business hours (descending)
    times.sort((a, b) => {
      const aBusiness = a.isBusinessHours.filter(h => h).length
      const bBusiness = b.isBusinessHours.filter(h => h).length
      return bBusiness - aBusiness
    })
    
    setBestTimes(times.slice(0, 12)) // Show top 12 best times
  }

  const addLocation = (location: MeetingLocation) => {
    if (!meetingLocations.find(loc => loc.id === location.id)) {
      setMeetingLocations([...meetingLocations, location])
    }
  }

  const removeLocation = (id: string) => {
    if (meetingLocations.length > 1) {
      setMeetingLocations(meetingLocations.filter(loc => loc.id !== id))
    }
  }

  const getBestTimeScore = (time: MeetingTime) => {
    const businessCount = time.isBusinessHours.filter(h => h).length
    const totalCount = time.isBusinessHours.length
    return `${businessCount}/${totalCount}`
  }

  const generateCalendarInvite = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) return ''
    
    const [hours, minutes] = meetingTime.split(':').map(Number)
    const startDate = new Date(meetingDate)
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + (meetingDuration * 60000))
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const start = formatDateForCalendar(startDate)
    const end = formatDateForCalendar(endDate)
    
    const locations = meetingLocations.map(loc => `${loc.name} (${loc.country})`).join(', ')
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Time & Date Tools//Meeting Planner//EN
BEGIN:VEVENT
UID:${Date.now()}@timedatetools.com
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:${meetingTitle}
DESCRIPTION:Meeting scheduled across multiple time zones\\n\\nLocations: ${locations}\\nDuration: ${meetingDuration} minutes
LOCATION:${locations}
END:VEVENT
END:VCALENDAR`
  }

  const downloadCalendarInvite = () => {
    const icsContent = generateCalendarInvite()
    if (!icsContent) return
    
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${meetingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Meeting Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Meeting Planner
          </CardTitle>
          <CardDescription>
            Find the best time for meetings across multiple time zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="planner">Meeting Setup</TabsTrigger>
              <TabsTrigger value="best-times">Best Times</TabsTrigger>
            </TabsList>
            
            <TabsContent value="planner" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meeting Title</label>
                  <Input
                    placeholder="Team Standup"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <Select value={meetingDuration.toString()} onValueChange={(value) => setMeetingDuration(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Meeting Locations */}
              <div>
                <label className="block text-sm font-medium mb-2">Meeting Locations</label>
                <div className="space-y-2">
                  {meetingLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${location.color}`}></div>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.country} • UTC{location.offset >= 0 ? '+' : ''}{location.offset}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocation(location.id)}
                        disabled={meetingLocations.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Add Location</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {popularLocations
                    .filter(loc => !meetingLocations.find(ml => ml.id === loc.id))
                    .slice(0, 8)
                    .map((location) => (
                      <Button
                        key={location.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addLocation(location)}
                        className="justify-start"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {location.name}
                      </Button>
                    ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="best-times" className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-2">Recommended Meeting Times</div>
                <div className="text-lg font-semibold text-blue-900">
                  Best times when most participants are available during business hours
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bestTimes.map((time, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-lg font-bold">
                          {time.hour.toString().padStart(2, '0')}:{time.minute.toString().padStart(2, '0')}
                        </div>
                        <Badge variant={time.isBusinessHours.filter(h => h).length === time.isBusinessHours.length ? "default" : "secondary"}>
                          {getBestTimeScore(time)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        {meetingLocations.map((location, locIndex) => (
                          <div key={location.id} className="flex items-center justify-between">
                            <span className="text-gray-600">{location.name}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{time.timeStrings[locIndex]}</span>
                              {time.isBusinessHours[locIndex] && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => {
                          setMeetingTime(`${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`)
                          setActiveTab('planner')
                        }}
                      >
                        Select Time
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Meeting Results */}
      {meetingResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Meeting Time Details</CardTitle>
            <CardDescription>
              Local times for each location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meetingResults.map((result) => (
                <Card key={result.id} className={`${result.isBusinessHours ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${result.color}`}></div>
                      <CardTitle className="text-lg">{result.name}</CardTitle>
                    </div>
                    <CardDescription>{result.country}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold mb-1">
                        {result.localTime}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {result.localDate}
                      </div>
                      <div className="text-sm mb-2">
                        <span className="font-medium">Ends:</span> {result.localEndTime}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant={result.isBusinessHours ? "default" : "destructive"}>
                          {result.isBusinessHours ? 'Business Hours' : 'Outside Business Hours'}
                        </Badge>
                        <Badge variant="outline">
                          UTC{result.offset >= 0 ? '+' : ''}{result.offset}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Calendar Invite */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Calendar Invite</h3>
                  <p className="text-sm text-gray-600">Download calendar file for all participants</p>
                </div>
                <Button onClick={downloadCalendarInvite} disabled={!meetingTitle}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Download .ics
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Meeting:</strong> {meetingTitle || 'Untitled Meeting'}</p>
                <p><strong>Duration:</strong> {meetingDuration} minutes</p>
                <p><strong>Locations:</strong> {meetingLocations.map(loc => loc.name).join(', ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Planning Tips</CardTitle>
          <CardDescription>
            Best practices for scheduling across time zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Optimal Timing
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Aim for 9 AM - 5 PM local time for all participants</li>
                <li>• Avoid early morning or late evening meetings</li>
                <li>• Consider lunch breaks in different regions</li>
                <li>• Be mindful of cultural differences in work hours</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Communication Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Always specify time zones in meeting invites</li>
                <li>• Send calendar invites with local times</li>
                <li>• Use meeting scheduler tools for recurring meetings</li>
                <li>• Confirm attendance across all time zones</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}