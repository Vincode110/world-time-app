'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Map, Globe, Clock, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface TimeZoneInfo {
  name: string
  offset: number
  displayName: string
  cities: string[]
  color: string
}

interface CityInfo {
  name: string
  country: string
  timezone: string
  offset: number
  lat: number
  lng: number
}

const timeZones: TimeZoneInfo[] = [
  { name: 'UTC-12', offset: -12, displayName: 'UTC-12:00', cities: ['Baker Island', 'Howland Island'], color: 'bg-purple-200' },
  { name: 'UTC-11', offset: -11, displayName: 'UTC-11:00', cities: ['American Samoa', 'Niue'], color: 'bg-purple-300' },
  { name: 'UTC-10', offset: -10, displayName: 'UTC-10:00', cities: ['Honolulu', 'Papeete'], color: 'bg-blue-200' },
  { name: 'UTC-9', offset: -9, displayName: 'UTC-09:00', cities: ['Anchorage', 'Gambier Islands'], color: 'bg-blue-300' },
  { name: 'UTC-8', offset: -8, displayName: 'UTC-08:00', cities: ['Los Angeles', 'Vancouver', 'Tijuana'], color: 'bg-blue-400' },
  { name: 'UTC-7', offset: -7, displayName: 'UTC-07:00', cities: ['Denver', 'Phoenix', 'Ciudad Juárez'], color: 'bg-green-200' },
  { name: 'UTC-6', offset: -6, displayName: 'UTC-06:00', cities: ['Chicago', 'Mexico City', 'Winnipeg'], color: 'bg-green-300' },
  { name: 'UTC-5', offset: -5, displayName: 'UTC-05:00', cities: ['New York', 'Toronto', 'Bogotá'], color: 'bg-green-400' },
  { name: 'UTC-4', offset: -4, displayName: 'UTC-04:00', cities: ['Halifax', 'Caracas', 'La Paz'], color: 'bg-yellow-200' },
  { name: 'UTC-3', offset: -3, displayName: 'UTC-03:00', cities: ['São Paulo', 'Buenos Aires', 'Rio de Janeiro'], color: 'bg-yellow-300' },
  { name: 'UTC-2', offset: -2, displayName: 'UTC-02:00', cities: ['Fernando de Noronha', 'South Georgia'], color: 'bg-yellow-400' },
  { name: 'UTC-1', offset: -1, displayName: 'UTC-01:00', cities: ['Azores', 'Cape Verde'], color: 'bg-orange-200' },
  { name: 'UTC', offset: 0, displayName: 'UTC±00:00', cities: ['London', 'Dublin', 'Lisbon', 'Accra'], color: 'bg-orange-300' },
  { name: 'UTC+1', offset: 1, displayName: 'UTC+01:00', cities: ['Paris', 'Berlin', 'Rome', 'Madrid'], color: 'bg-orange-400' },
  { name: 'UTC+2', offset: 2, displayName: 'UTC+02:00', cities: ['Cairo', 'Johannesburg', 'Athens', 'Istanbul'], color: 'bg-red-200' },
  { name: 'UTC+3', offset: 3, displayName: 'UTC+03:00', cities: ['Moscow', 'Riyadh', 'Nairobi', 'Doha'], color: 'bg-red-300' },
  { name: 'UTC+4', offset: 4, displayName: 'UTC+04:00', cities: ['Dubai', 'Baku', 'Tbilisi', 'Yerevan'], color: 'bg-red-400' },
  { name: 'UTC+5', offset: 5, displayName: 'UTC+05:00', cities: ['Karachi', 'Tashkent', 'Male'], color: 'bg-pink-200' },
  { name: 'UTC+5:30', offset: 5.5, displayName: 'UTC+05:30', cities: ['Mumbai', 'New Delhi', 'Colombo'], color: 'bg-pink-300' },
  { name: 'UTC+6', offset: 6, displayName: 'UTC+06:00', cities: ['Dhaka', 'Almaty', 'Omsk'], color: 'bg-pink-400' },
  { name: 'UTC+7', offset: 7, displayName: 'UTC+07:00', cities: ['Bangkok', 'Jakarta', 'Ho Chi Minh City'], color: 'bg-purple-200' },
  { name: 'UTC+8', offset: 8, displayName: 'UTC+08:00', cities: ['Beijing', 'Hong Kong', 'Singapore', 'Perth'], color: 'bg-purple-300' },
  { name: 'UTC+9', offset: 9, displayName: 'UTC+09:00', cities: ['Tokyo', 'Seoul', 'Pyongyang'], color: 'bg-purple-400' },
  { name: 'UTC+10', offset: 10, displayName: 'UTC+10:00', cities: ['Sydney', 'Melbourne', 'Brisbane'], color: 'bg-blue-200' },
  { name: 'UTC+11', offset: 11, displayName: 'UTC+11:00', cities: ['Solomon Islands', 'New Caledonia'], color: 'bg-blue-300' },
  { name: 'UTC+12', offset: 12, displayName: 'UTC+12:00', cities: ['Auckland', 'Wellington', 'Fiji'], color: 'bg-blue-400' },
]

const majorCities: CityInfo[] = [
  { name: 'New York', country: 'USA', timezone: 'America/New_York', offset: -5, lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', offset: -8, lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', country: 'USA', timezone: 'America/Chicago', offset: -6, lat: 41.8781, lng: -87.6298 },
  { name: 'London', country: 'UK', timezone: 'Europe/London', offset: 0, lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', offset: 1, lat: 48.8566, lng: 2.3522 },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', offset: 1, lat: 52.5200, lng: 13.4050 },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', offset: 3, lat: 55.7558, lng: 37.6173 },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', offset: 4, lat: 25.2048, lng: 55.2708 },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5, lat: 19.0760, lng: 72.8777 },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', offset: 8, lat: 1.3521, lng: 103.8198 },
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', offset: 8, lat: 39.9042, lng: 116.4074 },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 9, lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 11, lat: -33.8688, lng: 151.2093 },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', offset: 12, lat: -36.8485, lng: 174.7633 },
]

export function TimeZoneMap() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC')
  const [hoveredCity, setHoveredCity] = useState<CityInfo | null>(null)
  const [mapScale, setMapScale] = useState(1)
  const [showCities, setShowCities] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date, offset: number) => {
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
    const localTime = new Date(utcTime + (offset * 3600000))
    return localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const getCityTime = (city: CityInfo) => {
    const utcTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000)
    const cityTime = new Date(utcTime + (city.offset * 3600000))
    return cityTime
  }

  const projectToMap = (lng: number, lat: number) => {
    // Simple Mercator projection
    const x = (lng + 180) * (800 / 360)
    const y = (90 - lat) * (400 / 180)
    return { x, y }
  }

  const filteredCities = majorCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedTZ = timeZones.find(tz => tz.name === selectedTimeZone)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <Map className="h-5 w-5" />
            Interactive Time Zone Map
          </CardTitle>
          <CardDescription className="text-blue-100">
            Explore time zones across the world with real-time information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
              <SelectTrigger className="w-48 border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {timeZones.map((tz) => (
                  <SelectItem key={tz.name} value={tz.name}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${tz.color}`}></div>
                      <div>
                        <div className="font-medium">{tz.displayName}</div>
                        <div className="text-xs text-gray-500">{tz.cities.slice(0, 2).join(', ')}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapScale(Math.max(0.5, mapScale - 0.1))}
                disabled={mapScale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapScale(Math.min(2, mapScale + 0.1))}
                disabled={mapScale >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapScale(1)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant={showCities ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCities(!showCities)}
            >
              {showCities ? "Hide Cities" : "Show Cities"}
            </Button>
          </div>

          {selectedTZ && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded ${selectedTZ.color}`}></div>
                    <h3 className="text-lg font-semibold text-blue-900">{selectedTZ.displayName}</h3>
                  </div>
                  <div className="text-2xl font-mono font-bold text-blue-800">
                    {formatTime(currentTime, selectedTZ.offset)}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    Major cities: {selectedTZ.cities.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">Current UTC Time</div>
                  <div className="text-lg font-mono font-semibold text-blue-800">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                      timeZone: 'UTC'
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card className="border-blue-200 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-blue-50 overflow-auto" style={{ maxHeight: '600px' }}>
            <svg
              width="800"
              height="400"
              viewBox="0 0 800 400"
              className="border border-blue-200"
              style={{ transform: `scale(${mapScale})`, transformOrigin: 'center' }}
            >
              {/* World Map Background - Simplified continents */}
              <rect width="800" height="400" fill="#E0F2FE" />
              
              {/* North America */}
              <path d="M 150 120 L 250 100 L 280 140 L 260 180 L 200 200 L 150 180 Z" fill="#10B981" stroke="#059669" strokeWidth="1" />
              
              {/* South America */}
              <path d="M 220 220 L 250 210 L 260 280 L 240 320 L 210 300 L 200 250 Z" fill="#10B981" stroke="#059669" strokeWidth="1" />
              
              {/* Europe */}
              <path d="M 380 120 L 420 110 L 440 140 L 420 160 L 390 150 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              
              {/* Africa */}
              <path d="M 380 180 L 420 170 L 440 220 L 420 280 L 390 290 L 370 250 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              
              {/* Asia */}
              <path d="M 460 100 L 600 90 L 620 180 L 580 200 L 480 180 L 460 140 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
              
              {/* Australia */}
              <path d="M 580 280 L 640 270 L 660 300 L 640 320 L 600 310 Z" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1" />

              {/* Time Zone Lines */}
              {timeZones.map((tz, index) => {
                const x = ((tz.offset + 12) / 24) * 800
                return (
                  <line
                    key={tz.name}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={400}
                    stroke={tz.color.replace('bg-', '#').replace('200', 'CC').replace('300', '99').replace('400', '66')}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                )
              })}

              {/* City Markers */}
              {showCities && filteredCities.map((city) => {
                const pos = projectToMap(city.lng, city.lat)
                const cityTime = getCityTime(city)
                const isDaytime = cityTime.getHours() >= 6 && cityTime.getHours() < 18
                
                return (
                  <g key={city.name}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="6"
                      fill={isDaytime ? "#FCD34D" : "#1E40AF"}
                      stroke="#1F2937"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-8 transition-all"
                      onMouseEnter={() => setHoveredCity(city)}
                      onMouseLeave={() => setHoveredCity(null)}
                    />
                    <text
                      x={pos.x + 10}
                      y={pos.y - 10}
                      className="text-xs font-semibold fill-gray-800 pointer-events-none"
                    >
                      {city.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* City Information Panel */}
      {hoveredCity && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {hoveredCity.name}, {hoveredCity.country}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(currentTime, hoveredCity.offset)}
                </div>
                <div className="text-sm text-gray-500">Local Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  UTC{hoveredCity.offset >= 0 ? '+' : ''}{hoveredCity.offset}
                </div>
                <div className="text-sm text-gray-500">Time Zone</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {hoveredCity.lat.toFixed(2)}°N
                </div>
                <div className="text-sm text-gray-500">Latitude</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {hoveredCity.lng.toFixed(2)}°E
                </div>
                <div className="text-sm text-gray-500">Longitude</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Zone Legend */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle>Time Zone Reference</CardTitle>
          <CardDescription>
            Quick reference for major time zones around the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeZones.slice(0, 24).map((tz) => (
              <div
                key={tz.name}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedTimeZone === tz.name ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                }`}
                onClick={() => setSelectedTimeZone(tz.name)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded ${tz.color}`}></div>
                  <div className="font-medium text-sm">{tz.displayName}</div>
                </div>
                <div className="text-xs text-gray-600">
                  {formatTime(currentTime, tz.offset)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}