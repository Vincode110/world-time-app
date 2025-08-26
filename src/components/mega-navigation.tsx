'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { 
  Globe, 
  Clock, 
  Calendar, 
  Calculator, 
  Timer,
  Map,
  Search,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationCategories = [
  {
    title: 'World Clock',
    icon: Globe,
    description: 'Current time around the world',
    items: [
      { title: 'World Clock', href: '/world-clock', description: 'Current local times for cities worldwide' },
      { title: 'Time Zone Map', href: '/time-zone-map', description: 'Interactive world time zone map' },
    ]
  },
  {
    title: 'Time Zones',
    icon: Clock,
    description: 'Convert time between zones',
    items: [
      { title: 'Time Zone Converter', href: '/time-zone-converter', description: 'Calculate time differences' },
      { title: 'Meeting Planner', href: '/meeting-planner', description: 'Find best meeting times' },
      { title: 'Event Time Announcer', href: '/event-time-announcer', description: 'Share global event times' },
      { title: 'DST Information', href: '/dst-information', description: 'Daylight Saving Time details' },
    ]
  },
  {
    title: 'Calendar',
    icon: Calendar,
    description: 'View and create calendars',
    items: [
      { title: 'Monthly Calendar', href: '/monthly-calendar', description: 'View current month calendar' },
      { title: 'Yearly Calendar', href: '/yearly-calendar', description: 'Full year calendar view' },
      { title: 'Custom Calendar', href: '/custom-calendar', description: 'Create personalized calendars' },
      { title: 'Printable PDF', href: '/printable-calendar', description: 'Generate printable calendars' },
      { title: 'Holidays Worldwide', href: '/holidays', description: 'Global holiday information' },
    ]
  },
  {
    title: 'Calculators',
    icon: Calculator,
    description: 'Date and time calculations',
    items: [
      { title: 'Date Duration', href: '/date-duration', description: 'Calculate days between dates' },
      { title: 'Add/Subtract Dates', href: '/date-calculator', description: 'Add or subtract from dates' },
      { title: 'Time Duration', href: '/time-duration', description: 'Calculate time differences' },
      { title: 'Business Date', href: '/business-date', description: 'Calculate business days' },
      { title: 'Birthday Calculator', href: '/birthday-calculator', description: 'Age and milestone calculator' },
    ]
  },
  {
    title: 'Timers',
    icon: Timer,
    description: 'Countdown and stopwatch tools',
    items: [
      { title: 'Online Timer', href: '/online-timer', description: 'Set alarms and timers' },
      { title: 'Stopwatch', href: '/stopwatch', description: 'Time activities precisely' },
      { title: 'Countdown Creator', href: '/countdown', description: 'Create custom countdowns' },
    ]
  },
  {
    title: 'More Tools',
    icon: Map,
    description: 'Additional utilities',
    items: [
      { title: 'Distance Calculator', href: '/distance-calculator', description: 'Calculate distances' },
      { title: 'Site Search', href: '/search', description: 'Search our tools' },
      { title: 'Articles', href: '/articles', description: 'Educational content' },
    ]
  }
]

export function MegaNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement | null>(null)
  const triggerRefs = useRef<HTMLButtonElement[]>([])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        ;(document.activeElement as HTMLElement)?.blur()
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && triggerRefs.current.length > 0) {
        const activeIndex = triggerRefs.current.findIndex((el) => el === document.activeElement)
        if (activeIndex >= 0) {
          e.preventDefault()
          const dir = e.key === 'ArrowRight' ? 1 : -1
          const next = (activeIndex + dir + triggerRefs.current.length) % triggerRefs.current.length
          triggerRefs.current[next]?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div ref={navRef} className="w-full bg-white dark:bg-gray-900 shadow-sm border-b" role="navigation" aria-label="Primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Home">
            <Clock className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Time & Date Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationCategories.map((category, idx) => {
                const IconComponent = category.icon
                return (
                  <NavigationMenuItem key={category.title}>
                    <NavigationMenuTrigger
                      className="h-9 focus-visible:ring-2 focus-visible:ring-blue-500"
                      ref={(el: any) => (triggerRefs.current[idx] = el as HTMLButtonElement)}
                      aria-label={`${category.title} menu`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" aria-hidden="true" />
                      {category.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-4 md:w-[800px] md:grid-cols-2 lg:w-[900px] lg:grid-cols-3" role="menu">
                        <div className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-600 to-purple-600 p-6 no-underline outline-none focus:shadow-md"
                              href="#"
                              aria-label={`${category.title} overview`}
                            >
                              <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                              <div className="mb-2 mt-4 text-lg font-medium text-white">
                                {category.title}
                              </div>
                              <p className="text-sm leading-tight text-blue-100">
                                {category.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </div>
                        {category.items.map((item) => (
                          <NavigationMenuLink key={item.title} asChild>
                            <a
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                              href={item.href}
                              role="menuitem"
                            >
                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-menu" className="lg:hidden pb-4" role="menu">
            <div className="space-y-2">
              {navigationCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <div key={category.title} className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                      <span>{category.title}</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500"
                          role="menuitem"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}