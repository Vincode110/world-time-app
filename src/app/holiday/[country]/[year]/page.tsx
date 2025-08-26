import { notFound } from 'next/navigation'
import Script from 'next/script'
import { CalendarTools } from '@/components/calendar-tools'

type Params = { params: { country: string; year: string } }

const supported = ['US','UK','Canada','Australia']

export async function generateStaticParams() {
	const years = Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() + i}`)
	const params: { country: string; year: string }[] = []
	for (const c of supported) {
		for (const y of years) params.push({ country: c, year: y })
	}
	return params
}

export const dynamicParams = true

export default function CountryHolidaysPage({ params }: Params) {
	const country = decodeURIComponent(params.country)
	const year = parseInt(params.year)
	if (!supported.includes(country) || isNaN(year)) return notFound()

	const title = `${country} Holidays ${year} — Calendar & Observances`
	const description = `Public holidays and observances in ${country} for ${year}. Downloadable calendar with ISO week numbers and holiday overlays.`

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
			<Script id="ld-json-country-holidays" type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'SpecialAnnouncement',
						name: title,
						description,
						about: { '@type': 'Country', name: country },
						datePosted: new Date().toISOString(),
					}),
				}}
			/>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-2">{title}</h1>
				<p className="text-gray-600 mb-6">{description}</p>
				<CalendarTools />
				<div className="prose prose-sm max-w-none mt-8">
					<h2>About Holidays in {country}</h2>
					<p>
						This page lists national and notable observances in {country} for the year {year}. Dates are provided for convenience and may vary by region. Always verify observances for your locality when scheduling.
					</p>
				</div>
			</div>
		</div>
	)
}


