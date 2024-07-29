/** @type {import('jest').Config} */
const config = {
	preset: 'jest-expo',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
	],
	setupFilesAfterEnv: ['./jest.setup.js'],
	testEnvironment: 'jsdom',
	verbose: true,
	moduleNameMapper: {
		'^@/public/(.*)$': '<rootDir>/public/$1',
		'^@/assets/(.*)$': '<rootDir>/src/assets/$1',
		'^@/modules/(.*)$': '<rootDir>/src/components/modules/$1',
		'^@/layouts/(.*)$': '<rootDir>/src/components/layouts/$1',
		'^@/ui/(.*)$': '<rootDir>/src/components/ui/$1',
		'^@/wrappers/(.*)$': '<rootDir>/src/components/wrappers/$1',
		'^@/lib/(.*)$': '<rootDir>/src/lib/$1',
		'^@/data/(.*)$': '<rootDir>/src/lib/data/$1',
		'^@/helpers/(.*)$': '<rootDir>/src/lib/helpers/$1',
		'^@/hooks/(.*)$': '<rootDir>/src/lib/hooks/$1',
		'^@/providers/(.*)$': '<rootDir>/src/lib/providers/$1',
		'^@/contexts/(.*)$': '<rootDir>/src/lib/contexts/$1',
		'^@/types/(.*)$': '<rootDir>/src/lib/types/$1',
		'^@/utils/(.*)$': '<rootDir>/src/utils/$1',
		'^@/styles/(.*)$': '<rootDir>/src/styles/$1',
		'^@/app/(.*)$': '<rootDir>/src/app/$1',
		'^@/modals/(.*)$': '<rootDir>/src/components/modals/$1',
	},
	moduleDirectories: ['node_modules', '<rootDir>/'],
};

module.exports = config;
