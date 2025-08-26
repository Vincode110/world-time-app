import { notFound } from 'next/navigation'
import { getCurrentTimeInfo } from '@/lib/timezone'
import { getTimeZones } from '@vvo/tzdb'
import Script from 'next/script'

type Params = { params: { zone: string } }

export async function generateStaticParams() {
	return (getTimeZones() as any[]).slice(0, 1000).map((tz) => ({ zone: encodeURIComponent(tz.name) }))
}

export const dynamicParams = true

export default function CityPage({ params }: Params) {
	const decoded = decodeURIComponent(params.zone)
	const exists = (getTimeZones() as any[]).find((t) => t.name === decoded)
	if (!exists) return notFound()
	const info = getCurrentTimeInfo(decoded)
	const title = `${decoded} Time - Local Time, Offset & DST`
	const description = `Current local time in ${decoded}. Offset ${info.utcOffset}, DST ${info.dstActive ? 'active' : 'inactive'}.`

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
			<Script id="ld-json-city" type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Place',
						name: decoded,
						description,
						containsPlace: { '@type': 'AdministrativeArea', name: decoded },
					}),
				}}
			/>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-2">{title}</h1>
				<p className="text-gray-600 mb-6">{description}</p>
				<div className="p-6 bg-white rounded-lg shadow">
					<div className="text-5xl font-mono font-bold mb-2">{info.formattedTime}</div>
					<div className="text-gray-700">{info.formattedDate}</div>
					<div className="text-sm text-gray-500 mt-2">UTC Offset: {info.utcOffset} • DST: {info.dstActive ? 'Yes' : 'No'}</div>
				</div>
				<div className="prose prose-sm max-w-none mt-8">
					<h2>About {decoded} Time</h2>
					<p>
						This page shows the current local time, UTC offset, and Daylight Saving Time (DST) status for {decoded}. Times are calculated from bundled IANA data and update on refresh.
					</p>
					<h3>What is the UTC offset?</h3>
					<p>UTC offset indicates the difference from Coordinated Universal Time. When DST is active, the offset may change seasonally.</p>
				</div>
			</div>
		</div>
	)
}


