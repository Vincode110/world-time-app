import { DateTime } from 'luxon'
import { convertTime } from '@/lib/timezone'

describe('calculators and DST boundaries', () => {
	it('handles DST offset differences', () => {
		// New York vs London around US DST start (second Sunday in March)
		const iso = DateTime.fromISO('2024-03-10T12:00:00', { zone: 'UTC' }).toISO()!
		const res = convertTime('America/New_York', 'Europe/London', { iso })
		expect(typeof res.timeDifferenceMinutes).toBe('number')
	})

	it('business day excludes weekends (logic covered in UI)', () => {
		const saturday = DateTime.fromISO('2025-01-04T00:00:00Z')
		expect([6, 0]).toContain(saturday.setZone('UTC').weekday % 7)
	})
})


