'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Calculator, Gift, TrendingUp } from 'lucide-react'

interface BirthdayResult {
  age: number
  months: number
  days: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  nextBirthday: string
  daysUntilNextBirthday: number
  birthDay: string
  isBirthdayToday: boolean
  milestones: string[]
}

export default function BirthdayCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [result, setResult] = useState<BirthdayResult | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set default current date to today
    const today = new Date()
    setCurrentDate(today.toISOString().split('T')[0])
  }, [])

  const calculateBirthday = () => {
    if (!birthDate || !currentDate) return

    const birth = new Date(birthDate)
    const current = new Date(currentDate)

    if (birth > current) {
      alert('Birth date cannot be in the future!')
      return
    }

    // Calculate age
    let age = current.getFullYear() - birth.getFullYear()
    let months = current.getMonth() - birth.getMonth()
    let days = current.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      age--
      months += 12
    }

    // Calculate total values
    const diffTime = Math.abs(current.getTime() - birth.getTime())
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60))
    const totalMinutes = Math.floor(diffTime / (1000 * 60))
    const totalSeconds = Math.floor(diffTime / 1000)

    // Calculate next birthday
    const nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < current) {
      nextBirthday.setFullYear(current.getFullYear() + 1)
    }

    const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - current.getTime()) / (1000 * 60 * 60 * 24))
    
    // Get birth day of week
    const birthDay = birth.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Check if birthday is today
    const isBirthdayToday = current.getMonth() === birth.getMonth() && current.getDate() === birth.getDate()

    // Generate milestones
    const milestones = []
    const milestoneAges = [13, 16, 18, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 90, 100]
    
    for (const milestone of milestoneAges) {
      if (milestone > age) {
        const milestoneDate = new Date(birth.getFullYear() + milestone, birth.getMonth(), birth.getDate())
        const yearsUntil = milestone - age
        milestones.push(`${milestone}th birthday in ${yearsUntil} years (${milestoneDate.toLocaleDateString()})`)
      }
    }

    setResult({
      age,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: nextBirthday.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      daysUntilNextBirthday,
      birthDay,
      isBirthdayToday,
      milestones
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Birthday Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Calculate your exact age and upcoming birthday milestones
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculate Your Age
            </CardTitle>
            <CardDescription>
              Enter your birth date to calculate your exact age and next birthday
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={currentDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Date</label>
                <Input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={calculateBirthday} className="w-full">
              Calculate Age
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Your Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {result.age}
                    </div>
                    <div className="text-gray-600">years old</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-green-600">{result.months}</div>
                      <div className="text-sm text-gray-500">months</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-purple-600">{result.days}</div>
                      <div className="text-sm text-gray-500">days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-orange-600">{result.totalDays}</div>
                      <div className="text-sm text-gray-500">total days</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Born on a {result.birthDay}
                  </div>
                  {result.isBirthdayToday && (
                    <div className="text-center p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                      <div className="font-semibold text-yellow-800">🎉 Happy Birthday!</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Next Birthday
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600 mb-1">
                      {result.nextBirthday}
                    </div>
                    <div className="text-gray-600">
                      in {result.daysUntilNextBirthday} days
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Time Units Lived:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">{result.totalHours.toLocaleString()}</div>
                        <div className="text-gray-500">hours</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">{result.totalMinutes.toLocaleString()}</div>
                        <div className="text-gray-500">minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.milestones.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Upcoming Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.milestones.map((milestone, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-blue-800">{milestone}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}