'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Globe, Calendar, Calculator, Timer, Sun, Cloud, Map, Search, Users } from 'lucide-react'
import { MegaNavigation } from '@/components/mega-navigation'
import '@/styles/animations.css'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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

  const mainCategories = [
    {
      id: 'world-clock',
      title: 'World Clock',
      description: 'Current local times for cities worldwide with DST adjustments',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      features: [
        'World Clock - Display current times globally',
        'Personal World Clock - Customize your city list',
        'Time Zone Map - Interactive world time overview',
        'Country-Specific Time Zones - USA, UK, Canada, Australia, NZ'
      ]
    },
    {
      id: 'time-zones',
      title: 'Time Zones',
      description: 'Convert time between different zones and plan meetings',
      icon: Clock,
      color: 'from-green-500 to-green-600',
      features: [
        'Time Zone Converter - Calculate time differences',
        'Meeting Planner - Find best meeting times across zones',
        'Event Time Announcer - Share global event times',
        'DST Information - Daylight Saving Time details'
      ]
    },
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'View, customize, and print calendars with holidays',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Monthly & Yearly Calendars - View any year',
        'Custom Calendar Generator - Personalized calendars',
        'Printable PDF Templates - Generate and print',
        'Holidays & Observances - Global events integration'
      ]
    },
    {
      id: 'calculators',
      title: 'Date & Time Calculators',
      description: 'Precise calculations for dates, times, and durations',
      icon: Calculator,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Date Duration Calculator - Days between dates',
        'Add/Subtract from Dates - Time manipulation',
        'Time Duration Calculator - Precise elapsed time',
        'Business Date Calculator - Working days calculation'
      ]
    },
    {
      id: 'timers',
      title: 'Timers & Countdowns',
      description: 'Professional timing tools for all your needs',
      icon: Timer,
      color: 'from-red-500 to-red-600',
      features: [
        'Online Timer with Alarm - Multiple simultaneous timers',
        'Stopwatch - Precise timing with lap functions',
        'Countdown Creator - Custom countdowns to any date'
      ]
    }
  ]

  const popularTools = [
    { name: 'World Clock', icon: Globe, category: 'World Clock', description: 'Check current time worldwide' },
    { name: 'Time Zone Converter', icon: Clock, category: 'Time Zones', description: 'Convert between time zones' },
    { name: 'Meeting Planner', icon: Users, category: 'Time Zones', description: 'Schedule across time zones' },
    { name: 'Calendar', icon: Calendar, category: 'Calendar', description: 'View monthly calendar' },
    { name: 'Date Calculator', icon: Calculator, category: 'Calculators', description: 'Calculate date differences' },
    { name: 'Timer', icon: Timer, category: 'Timers', description: 'Set countdown timer' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <MegaNavigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden animated-gradient-blue text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animate-stagger-2"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animate-stagger-4"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Time & Date Tools
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slideInLeft">
              Your comprehensive destination for time and date calculations
            </p>
            
            {/* Current Time Display */}
            <Card className="max-w-md mx-auto glass border-white/20 animate-scaleIn animate-stagger-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6 animate-pulse" />
                  Current Time
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {formatDate(currentTime)}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-mono font-bold text-white mb-4 time-display">
                  {formatTime(currentTime)}
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <Globe className="h-4 w-4 animate-rotate" />
                  <span>Your Local Time</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Popular Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Quick access to our most frequently used time and date tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {popularTools.map((tool, index) => {
            const IconComponent = tool.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer card-hover animate-slideInLeft animate-stagger-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{tool.name}</CardTitle>
                      <CardDescription className="text-sm">{tool.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {tool.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full btn-animate group-hover:bg-blue-50 group-hover:border-blue-300">
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="bg-white/50 dark:bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Comprehensive Tool Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our complete collection of professional time and date tools designed for accuracy and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mainCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden card-hover animate-slideInRight animate-stagger-2">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{category.title}</CardTitle>
                        <CardDescription className="text-sm">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 group-hover:translate-x-1 transition-transform">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 btn-animate group-hover:bg-blue-50 group-hover:border-blue-300">
                      Explore {category.title}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose Our Tools?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional-grade time and date tools with emphasis on accuracy and ease of use
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slideInLeft animate-stagger-1">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Always Accurate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time updates with precise time zone calculations and DST adjustments
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slideInLeft animate-stagger-2">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Global Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive time zone database covering all countries and major cities worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slideInLeft animate-stagger-3">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>No Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                All tools are instantly accessible without requiring account creation or sign-ups
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">Time & Date Tools</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your comprehensive destination for time and date calculations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Time Tools</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">World Clock</a></li>
                <li><a href="#" className="hover:text-white">Time Zone Converter</a></li>
                <li><a href="#" className="hover:text-white">Meeting Planner</a></li>
                <li><a href="#" className="hover:text-white">Event Time Announcer</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Date Tools</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Calendar</a></li>
                <li><a href="#" className="hover:text-white">Date Calculators</a></li>
                <li><a href="#" className="hover:text-white">Business Days</a></li>
                <li><a href="#" className="hover:text-white">Holidays</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Other Tools</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Timer & Stopwatch</a></li>
                <li><a href="#" className="hover:text-white">Distance Calculator</a></li>
                <li><a href="#" className="hover:text-white">Site Search</a></li>
                <li><a href="#" className="hover:text-white">Articles</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Time & Date Tools. All rights reserved. | No registration required</p>
          </div>
        </div>
      </footer>
    </div>
  )
}