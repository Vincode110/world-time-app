import { defineConfig } from '@playwright/test'

export default defineConfig({
	reporter: [['list'], ['junit', { outputFile: 'playwright-report/results.xml' }]],
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
		headless: true,
	},
})


