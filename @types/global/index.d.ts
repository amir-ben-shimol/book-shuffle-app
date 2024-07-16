/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly EXPO_PUBLIC_APP_ENV: 'local' | 'development' | 'test' | 'production';
			readonly EXPO_PUBLIC_BACKEND_URL: string;
			readonly EXPO_PUBLIC_RUN_WITH_MOCK: 'true' | 'false';
			readonly APPLE_TEAM_ID: string;
		}
	}
}

export {};
