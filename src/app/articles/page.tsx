'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BookOpen, Clock, Globe, Calendar, Calculator, Timer, Search, ChevronRight } from 'lucide-react'

interface Article {
  id: string
  title: string
  description: string
  content: string
  category: string
  readTime: number
  publishDate: string
  tags: string[]
  featured: boolean
}

const articles: Article[] = [
  {
    id: 'understanding-time-zones',
    title: 'Understanding Time Zones: A Complete Guide',
    description: 'Learn how time zones work, their history, and how to work with them effectively.',
    content: `Time zones are regions of the Earth that have the same standard time. They were created to solve the problem of different solar times across the world as the Earth rotates.

The world is divided into 24 time zones, each roughly 15 degrees of longitude wide. However, political boundaries have created many exceptions to this rule.

Key concepts:
- UTC (Coordinated Universal Time) is the primary time standard
- Time zones are typically expressed as offsets from UTC
- Daylight Saving Time adds complexity to time zone calculations
- Some countries have multiple time zones due to their size`,
    category: 'Time Zones',
    readTime: 8,
    publishDate: '2024-01-15',
    tags: ['time zones', 'UTC', 'offset', 'geography'],
    featured: true
  },
  {
    id: 'meeting-across-timezones',
    title: 'How to Schedule Meetings Across Time Zones',
    description: 'Best practices for organizing meetings when participants are in different time zones.',
    content: `Scheduling meetings across time zones requires careful planning and consideration. Here are the key strategies:

1. Find overlapping business hours
2. Use time zone conversion tools
3. Be mindful of cultural differences
4. Consider daylight saving time changes
5. Use calendar invites with time zone information

Tools that can help:
- World clock displays
- Time zone converters
- Meeting planners
- Calendar applications with time zone support`,
    category: 'Business',
    readTime: 6,
    publishDate: '2024-01-20',
    tags: ['meetings', 'scheduling', 'business', 'productivity'],
    featured: true
  },
  {
    id: 'date-calculations-explained',
    title: 'Date Calculations Explained',
    description: 'Understanding how date calculations work, including leap years and business days.',
    content: `Date calculations can be complex due to various factors:

Leap Years:
- Occur every 4 years
- Skip years divisible by 100 but not by 400
- Affect date calculations and age calculations

Business Days:
- Typically Monday through Friday
- Exclude weekends and holidays
- Used for business calculations and deadlines

Common calculations:
- Days between dates
- Add/subtract days from dates
- Calculate working days
- Determine age in years, months, and days`,
    category: 'Calculations',
    readTime: 10,
    publishDate: '2024-01-25',
    tags: ['dates', 'calculations', 'leap years', 'business days'],
    featured: false
  },
  {
    id: 'calendar-systems-world',
    title: 'Calendar Systems Around the World',
    description: 'Explore different calendar systems used globally and their unique characteristics.',
    content: `Different cultures use different calendar systems:

Gregorian Calendar:
- Most widely used civil calendar
- Introduced in 1582
- Solar-based with 365/366 days

Other calendar systems:
- Islamic Calendar (lunar)
- Hebrew Calendar (lunisolar)
- Chinese Calendar (lunisolar)
- Indian National Calendar

Understanding these calendars is important for:
- International business
- Cultural awareness
- Historical research
- Religious observances`,
    category: 'Calendars',
    readTime: 12,
    publishDate: '2024-02-01',
    tags: ['calendars', 'cultures', 'history', 'international'],
    featured: false
  },
  {
    id: 'time-management-techniques',
    title: 'Time Management Techniques for Remote Work',
    description: 'Effective time management strategies for remote and hybrid work environments.',
    content: `Remote work requires excellent time management:

Key techniques:
1. Time blocking
2. Pomodoro Technique
3. Using digital calendars effectively
4. Setting boundaries between work and personal time
5. Leveraging time zone differences for global teams

Tools that help:
- Digital calendars with reminders
- Time tracking software
- World clock applications
- Project management tools
- Communication platforms with scheduling features`,
    category: 'Productivity',
    readTime: 7,
    publishDate: '2024-02-05',
    tags: ['productivity', 'remote work', 'time management'],
    featured: true
  },
  {
    id: 'daylight-saving-time',
    title: 'Daylight Saving Time: History and Impact',
    description: 'The history, purpose, and effects of Daylight Saving Time changes.',
    content: `Daylight Saving Time (DST) has a fascinating history:

History:
- First proposed by Benjamin Franklin
- First implemented during World War I
- Adopted by many countries to save energy

Impact:
- Affects business hours and schedules
- Impacts international communication
- Can cause confusion in scheduling
- Has health and safety implications

Current status:
- Not all countries observe DST
- Start and end dates vary by location
- Some regions are considering eliminating DST`,
    category: 'Time Zones',
    readTime: 9,
    publishDate: '2024-02-10',
    tags: ['DST', 'daylight saving', 'time changes', 'history'],
    featured: false
  }
]

const categories = ['All', ...Array.from(new Set(articles.map(article => article.category)))]

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredArticles, setFilteredArticles] = useState(articles)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterArticles(category, searchTerm)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterArticles(selectedCategory, term)
  }

  const filterArticles = (category: string, term: string) => {
    let filtered = articles

    if (category !== 'All') {
      filtered = filtered.filter(article => article.category === category)
    }

    if (term.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(term.toLowerCase()) ||
        article.description.toLowerCase().includes(term.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      )
    }

    setFilteredArticles(filtered)
  }

  const featuredArticles = articles.filter(article => article.featured)
  const recentArticles = articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Articles & Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn about time zones, productivity, and effective time management
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredArticles.slice(0, 2).map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">Featured</Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {article.readTime} min read
                    </div>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full">
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Browse Articles
            </CardTitle>
            <CardDescription>
              Search and filter our collection of time and productivity articles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
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

        {/* Recent Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4" />
                    {article.readTime} min read
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {article.category}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">All Articles</h2>
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or browse all categories
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {article.title}
                          </h3>
                          {article.featured && (
                            <Badge variant="default">Featured</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime} min read
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(article.publishDate).toLocaleDateString()}
                          </div>
                          <Badge variant="outline">
                            {article.category}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="ml-4">
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}