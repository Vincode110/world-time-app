'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, Globe, Calendar, Calculator, Timer, MapPin } from 'lucide-react'

interface Tool {
  name: string
  description: string
  category: string
  href: string
  icon: any
  keywords: string[]
}

const tools: Tool[] = [
  {
    name: 'World Clock',
    description: 'Current local times for cities worldwide',
    category: 'Time Tools',
    href: '/world-clock',
    icon: Globe,
    keywords: ['time', 'clock', 'world', 'cities', 'global', 'timezone']
  },
  {
    name: 'Personal World Clock',
    description: 'Customize your city list with favorite locations',
    category: 'Time Tools',
    href: '/personal-world-clock',
    icon: Clock,
    keywords: ['personal', 'custom', 'cities', 'favorites', 'world clock']
  },
  {
    name: 'Time Zone Converter',
    description: 'Convert time between different time zones',
    category: 'Time Tools',
    href: '/time-zone-converter',
    icon: Clock,
    keywords: ['converter', 'timezone', 'time conversion', 'difference']
  },
  {
    name: 'Meeting Planner',
    description: 'Find best meeting times across time zones',
    category: 'Time Tools',
    href: '/meeting-planner',
    icon: Clock,
    keywords: ['meeting', 'planner', 'schedule', 'timezone', 'business']
  },
  {
    name: 'Event Time Announcer',
    description: 'Share global event times across time zones',
    category: 'Time Tools',
    href: '/event-time-announcer',
    icon: Clock,
    keywords: ['event', 'announcer', 'global', 'share', 'timezone']
  },
  {
    name: 'DST Information',
    description: 'Daylight Saving Time details and changes',
    category: 'Time Tools',
    href: '/dst-information',
    icon: Clock,
    keywords: ['dst', 'daylight saving', 'summer time', 'time change']
  },
  {
    name: 'Monthly Calendar',
    description: 'View current month calendar with holidays',
    category: 'Calendar Tools',
    href: '/monthly-calendar',
    icon: Calendar,
    keywords: ['calendar', 'month', 'holidays', 'current month']
  },
  {
    name: 'Yearly Calendar',
    description: 'Full year calendar view with holidays',
    category: 'Calendar Tools',
    href: '/yearly-calendar',
    icon: Calendar,
    keywords: ['calendar', 'year', 'yearly', 'holidays']
  },
  {
    name: 'Custom Calendar',
    description: 'Create personalized calendars',
    category: 'Calendar Tools',
    href: '/custom-calendar',
    icon: Calendar,
    keywords: ['custom', 'personalized', 'calendar', 'create']
  },
  {
    name: 'Printable Calendar',
    description: 'Generate and print calendars',
    category: 'Calendar Tools',
    href: '/printable-calendar',
    icon: Calendar,
    keywords: ['printable', 'print', 'calendar', 'pdf']
  },
  {
    name: 'Holidays Worldwide',
    description: 'Global holiday information',
    category: 'Calendar Tools',
    href: '/holidays',
    icon: Calendar,
    keywords: ['holidays', 'global', 'worldwide', 'celebrations']
  },
  {
    name: 'Date Duration',
    description: 'Calculate days between dates',
    category: 'Calculators',
    href: '/date-duration',
    icon: Calculator,
    keywords: ['duration', 'between dates', 'days calculator', 'date difference']
  },
  {
    name: 'Date Calculator',
    description: 'Add or subtract from dates',
    category: 'Calculators',
    href: '/date-calculator',
    icon: Calculator,
    keywords: ['calculator', 'add', 'subtract', 'date manipulation']
  },
  {
    name: 'Time Duration',
    description: 'Calculate time differences',
    category: 'Calculators',
    href: '/time-duration',
    icon: Calculator,
    keywords: ['time duration', 'difference', 'elapsed time']
  },
  {
    name: 'Business Date',
    description: 'Calculate business days',
    category: 'Calculators',
    href: '/business-date',
    icon: Calculator,
    keywords: ['business', 'working days', 'weekdays', 'excluding weekends']
  },
  {
    name: 'Birthday Calculator',
    description: 'Age and milestone calculator',
    category: 'Calculators',
    href: '/birthday-calculator',
    icon: Calculator,
    keywords: ['birthday', 'age', 'milestone', 'anniversary']
  },
  {
    name: 'Online Timer',
    description: 'Set alarms and timers',
    category: 'Timer Tools',
    href: '/online-timer',
    icon: Timer,
    keywords: ['timer', 'alarm', 'online', 'countdown']
  },
  {
    name: 'Stopwatch',
    description: 'Time activities precisely',
    category: 'Timer Tools',
    href: '/stopwatch',
    icon: Timer,
    keywords: ['stopwatch', 'precision', 'timing', 'laps']
  },
  {
    name: 'Countdown Creator',
    description: 'Create custom countdowns',
    category: 'Timer Tools',
    href: '/countdown',
    icon: Timer,
    keywords: ['countdown', 'creator', 'custom', 'event']
  },
  {
    name: 'Distance Calculator',
    description: 'Calculate distances between cities',
    category: 'Utilities',
    href: '/distance-calculator',
    icon: MapPin,
    keywords: ['distance', 'calculator', 'cities', 'geographic', 'coordinates']
  }
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchResults, setSearchResults] = useState<Tool[]>(tools)

  const categories = ['All', ...Array.from(new Set(tools.map(tool => tool.category)))]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    
    if (!term.trim() && selectedCategory === 'All') {
      setSearchResults(tools)
      return
    }

    const filtered = tools.filter(tool => {
      const matchesSearch = !term.trim() || 
        tool.name.toLowerCase().includes(term.toLowerCase()) ||
        tool.description.toLowerCase().includes(term.toLowerCase()) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    setSearchResults(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    
    if (category === 'All' && !searchTerm.trim()) {
      setSearchResults(tools)
      return
    }

    const filtered = tools.filter(tool => {
      const matchesSearch = !searchTerm.trim() || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = category === 'All' || tool.category === category
      
      return matchesSearch && matchesCategory
    })

    setSearchResults(filtered)
  }

  const popularSearches = [
    'world clock', 'time zone converter', 'meeting planner', 
    'calendar', 'date calculator', 'timer', 'stopwatch'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Search Tools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find the perfect time and date tool for your needs
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Our Tools
            </CardTitle>
            <CardDescription>
              Search by tool name, description, or keywords
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for tools..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {!searchTerm && selectedCategory === 'All' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
              <CardDescription>
                Try these popular search terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No tools found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all tools
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setSearchResults(tools)
                  }}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Found {searchResults.length} tool{searchResults.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </div>
              
              {searchResults.map((tool, index) => {
                const IconComponent = tool.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {tool.name}
                            </h3>
                            <Badge variant="outline">
                              {tool.category}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {tool.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {tool.keywords.slice(0, 3).map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {tool.keywords.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tool.keywords.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = tool.href}
                          >
                            Open Tool
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}