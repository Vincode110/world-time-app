/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	reporters: ['default', ['jest-junit', { outputDirectory: '.', outputName: 'junit.xml' }]],
	testMatch: ['**/__tests__/**/*.(ts|tsx|js)'],
}


