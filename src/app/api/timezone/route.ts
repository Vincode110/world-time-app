import { NextResponse } from "next/server"
import { convertTime, getCurrentTimeInfo } from '@/lib/timezone'

// This API will need a time zone service
// Recommended: TimezoneDB API (https://timezonedb.com/api)
// Alternative: Google Maps Time Zone API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timezone = searchParams.get('timezone')
  const timestamp = searchParams.get('timestamp')

  if (!timezone) {
    return NextResponse.json({ error: "timezone is required" }, { status: 400 })
  }

  try {
    const at = timestamp ? Number(timestamp) : undefined
    const info = getCurrentTimeInfo(timezone, at)
    return NextResponse.json(info)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to get timezone" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fromTimezone, toTimezone, timestamp, iso } = body

    if (!fromTimezone || !toTimezone) {
      return NextResponse.json({ error: "fromTimezone and toTimezone are required" }, { status: 400 })
    }

    const result = convertTime(fromTimezone, toTimezone, { timestamp, iso })
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to convert time" }, { status: 400 })
  }
}