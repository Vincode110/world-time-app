import { NextResponse } from 'next/server'
import { getTimeZones } from '@vvo/tzdb'

export async function POST() {
	// In a real deployment, this would call revalidatePath for ISR and write sitemap entries.
	// Here we return the enumerated pages as a preview of what would be warmed.
	const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i)
	const countries = ['US','UK','Canada','Australia']

	const cityPages = (getTimeZones() as any[]).slice(0, 1200).map((tz) => `/city/${encodeURIComponent(tz.name)}`)
	const holidayPages = countries.flatMap((c) => years.map((y) => `/holiday/${c}/${y}`))

	return NextResponse.json({
		summary: {
			cities: cityPages.length,
			holidaySets: holidayPages.length,
			total: cityPages.length + holidayPages.length,
		},
		preview: [...cityPages.slice(0, 5), ...holidayPages.slice(0, 5)],
	})
}

export async function GET() {
	return NextResponse.json({
		message: 'Seed endpoint. Use POST to enumerate and (optionally) warm ISR.',
		usage: {
			method: 'POST',
			path: '/api/seed',
			returns: '{ summary, preview }'
		}
	})
}


