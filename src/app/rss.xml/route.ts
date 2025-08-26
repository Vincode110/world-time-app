import { NextResponse } from 'next/server'

export async function GET() {
	const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
	const items = [
		{ title: 'World Clock', link: `${base}/world-clock`, description: 'Live local times worldwide.' },
		{ title: 'Time Zone Converter', link: `${base}/time-zone-converter`, description: 'Convert date and time across zones.' },
		{ title: 'Calendars', link: `${base}/monthly-calendar`, description: 'Monthly and yearly calendars with holidays.' },
	]
	const now = new Date().toUTCString()
	const xml = `<?xml version="1.0" encoding="UTF-8" ?>\n` +
		`<rss version="2.0"><channel>` +
		`<title>Time & Date Tools</title>` +
		`<link>${base}</link>` +
		`<description>Latest time and date tools and updates</description>` +
		`<lastBuildDate>${now}</lastBuildDate>` +
		items
			.map((i) => `<item><title>${i.title}</title><link>${i.link}</link><description>${i.description}</description><pubDate>${now}</pubDate></item>`)
			.join('') +
		`</channel></rss>`
	return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml' } })
}


