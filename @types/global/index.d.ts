/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly EXPO_PUBLIC_GOODREADS_API_KEY: string;
		}
	}
}

export {};
