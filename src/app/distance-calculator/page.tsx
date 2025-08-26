'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MapPin, Route, Calculator } from 'lucide-react'

interface Location {
  name: string
  lat: number
  lng: number
  country: string
}

interface DistanceResult {
  distance: number
  bearing: number
  midpoint: { lat: number; lng: number }
  distanceKm: number
  distanceMiles: number
  distanceNautical: number
}

const popularLocations: Location[] = [
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, country: 'Russia' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'USA' },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, country: 'USA' },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil' }
]

export default function DistanceCalculator() {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [customFromLat, setCustomFromLat] = useState('')
  const [customFromLng, setCustomFromLng] = useState('')
  const [customToLat, setCustomToLat] = useState('')
  const [customToLng, setCustomToLng] = useState('')
  const [unit, setUnit] = useState<'km' | 'miles' | 'nautical'>('km')
  const [result, setResult] = useState<DistanceResult | null>(null)
  const [useCustom, setUseCustom] = useState(false)

  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180)
  }

  const toDegrees = (radians: number) => {
    return radians * (180 / Math.PI)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const dLng = toRadians(lng2 - lng1)
    const lat1Rad = toRadians(lat1)
    const lat2Rad = toRadians(lat2)
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)
    
    let bearing = Math.atan2(y, x)
    bearing = toDegrees(bearing)
    bearing = (bearing + 360) % 360
    
    return bearing
  }

  const calculateMidpoint = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const lat1Rad = toRadians(lat1)
    const lng1Rad = toRadians(lng1)
    const lat2Rad = toRadians(lat2)
    const lng2Rad = toRadians(lng2)
    
    const dLng = lng2Rad - lng1Rad
    
    const bx = Math.cos(lat2Rad) * Math.cos(dLng)
    const by = Math.cos(lat2Rad) * Math.sin(dLng)
    
    const lat3 = Math.atan2(
      Math.sin(lat1Rad) + Math.sin(lat2Rad),
      Math.sqrt((Math.cos(lat1Rad) + bx) * (Math.cos(lat1Rad) + bx) + by * by)
    )
    const lng3 = lng1Rad + Math.atan2(by, Math.cos(lat1Rad) + bx)
    
    return {
      lat: toDegrees(lat3),
      lng: toDegrees(lng3)
    }
  }

  const handleCalculate = () => {
    let from: Location, to: Location

    if (useCustom) {
      if (!customFromLat || !customFromLng || !customToLat || !customToLng) {
        alert('Please enter all coordinates')
        return
      }
      from = {
        name: 'Custom Location',
        lat: parseFloat(customFromLat),
        lng: parseFloat(customFromLng),
        country: 'Custom'
      }
      to = {
        name: 'Custom Location',
        lat: parseFloat(customToLat),
        lng: parseFloat(customToLng),
        country: 'Custom'
      }
    } else {
      if (!fromLocation || !toLocation) {
        alert('Please select both locations')
        return
      }
      from = popularLocations.find(loc => loc.name === fromLocation)!
      to = popularLocations.find(loc => loc.name === toLocation)!
    }

    const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng)
    const bearing = calculateBearing(from.lat, from.lng, to.lat, to.lng)
    const midpoint = calculateMidpoint(from.lat, from.lng, to.lat, to.lng)

    setResult({
      distance,
      bearing,
      midpoint,
      distanceKm: distance,
      distanceMiles: distance * 0.621371,
      distanceNautical: distance * 0.539957
    })
  }

  const getBearingDirection = (bearing: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(bearing / 22.5) % 16
    return directions[index]
  }

  const formatDistance = (distance: number) => {
    switch (unit) {
      case 'km':
        return `${distance.toFixed(2)} km`
      case 'miles':
        return `${(distance * 0.621371).toFixed(2)} miles`
      case 'nautical':
        return `${(distance * 0.539957).toFixed(2)} nautical miles`
      default:
        return `${distance.toFixed(2)} km`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Distance Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Calculate distances between cities and geographic coordinates
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculate Distance
            </CardTitle>
            <CardDescription>
              Choose between popular cities or enter custom coordinates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button
                variant={!useCustom ? "default" : "outline"}
                onClick={() => setUseCustom(false)}
                className="flex-1"
              >
                Popular Cities
              </Button>
              <Button
                variant={useCustom ? "default" : "outline"}
                onClick={() => setUseCustom(true)}
                className="flex-1"
              >
                Custom Coordinates
              </Button>
            </div>

            {useCustom ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">From Location</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Latitude</label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 40.7128"
                        value={customFromLat}
                        onChange={(e) => setCustomFromLat(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Longitude</label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., -74.0060"
                        value={customFromLng}
                        onChange={(e) => setCustomFromLng(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">To Location</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Latitude</label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 51.5074"
                        value={customToLat}
                        onChange={(e) => setCustomToLat(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Longitude</label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., -0.1278"
                        value={customToLng}
                        onChange={(e) => setCustomToLng(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {popularLocations.map((location) => (
                        <SelectItem key={location.name} value={location.name}>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-gray-500">{location.country}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {popularLocations.map((location) => (
                        <SelectItem key={location.name} value={location.name}>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-gray-500">{location.country}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Distance Unit</label>
                <Select value={unit} onValueChange={(value: 'km' | 'miles' | 'nautical') => setUnit(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Kilometers</SelectItem>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="nautical">Nautical Miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCalculate} className="mt-6">
                Calculate Distance
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Distance Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatDistance(result.distance)}
                    </div>
                    <div className="text-gray-600">Direct distance</div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Kilometers</div>
                      <div className="font-medium">{result.distanceKm.toFixed(2)} km</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Miles</div>
                      <div className="font-medium">{result.distanceMiles.toFixed(2)} miles</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Nautical Miles</div>
                      <div className="font-medium">{result.distanceNautical.toFixed(2)} NM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {result.bearing.toFixed(1)}°
                    </div>
                    <div className="text-gray-600">
                      {getBearingDirection(result.bearing)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Midpoint Coordinates:</div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-medium">
                        {result.midpoint.lat.toFixed(4)}°N, {result.midpoint.lng.toFixed(4)}°E
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1">How to read bearing:</div>
                    <ul className="space-y-1">
                      <li>• 0° = North</li>
                      <li>• 90° = East</li>
                      <li>• 180° = South</li>
                      <li>• 270° = West</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!useCustom && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Popular Distance Calculations</CardTitle>
              <CardDescription>
                Quick access to common distance calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { from: 'New York', to: 'London', label: 'New York ↔ London' },
                  { from: 'Tokyo', to: 'Sydney', label: 'Tokyo ↔ Sydney' },
                  { from: 'Paris', to: 'Berlin', label: 'Paris ↔ Berlin' },
                  { from: 'Los Angeles', to: 'New York', label: 'LA ↔ New York' },
                  { from: 'Singapore', to: 'Dubai', label: 'Singapore ↔ Dubai' },
                  { from: 'Toronto', to: 'Chicago', label: 'Toronto ↔ Chicago' }
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => {
                      setFromLocation(item.from)
                      setToLocation(item.to)
                      setUseCustom(false)
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}