import { NextResponse } from 'next/server'
import { getTimeZones } from '@vvo/tzdb'

export async function GET() {
	const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
	const staticPaths = [
		'',
		'/world-clock',
		'/time-zone-converter',
		'/time-zone-map',
		'/meeting-planner',
		'/monthly-calendar',
		'/yearly-calendar',
		'/custom-calendar',
		'/printable-calendar',
		'/date-duration',
		'/date-calculator',
		'/time-duration',
		'/business-date',
		'/birthday-calculator',
		'/online-timer',
		'/stopwatch',
		'/countdown',
		'/articles',
		'/search',
	]

	const cityPaths = (getTimeZones() as any[]).slice(0, 1000).map((tz) => `/city/${encodeURIComponent(tz.name)}`)

	const urls = [...staticPaths, ...cityPaths]
	const now = new Date().toISOString()
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
		urls
			.map((path) => {
				return `<url><loc>${base}${path}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
			})
			.join('') +
		`</urlset>`

	return new NextResponse(xml, {
		headers: { 'Content-Type': 'application/xml' },
	})
}


