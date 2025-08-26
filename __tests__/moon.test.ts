import { calculateMoonPhase } from '@/lib/moon'

describe('moon phases', () => {
	it('returns consistent phase name for known dates', () => {
		const d = new Date('2024-04-08T00:00:00Z')
		const p = calculateMoonPhase(d)
		expect(p.phaseName).toBeDefined()
		expect(p.phaseAngle).toBeGreaterThanOrEqual(0)
		expect(p.phaseAngle).toBeLessThan(360)
	})

	it('works across multiple years including leap years', () => {
		for (let y = 2020; y <= 2030; y++) {
			const p = calculateMoonPhase(new Date(Date.UTC(y, 1, 29)))
			expect(p.phaseAngle).toBeGreaterThanOrEqual(0)
			expect(p.phaseAngle).toBeLessThan(360)
		}
	})
})


