// src/utils/backend-service.ts
import type { HttpMethod } from '../types/api/http';

async function fetcher<R = unknown, D = unknown>(path: string, method: HttpMethod, data?: D): Promise<R> {
	const headers = new Headers();

	headers.append('Content-Type', 'application/json');

	const response = await fetch(path, {
		method: method,
		headers,
		body: data ? JSON.stringify(data) : undefined,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const text = await response.text();

	return text as unknown as R;
}

const BackendService = {
	get<R = string>(path: string): Promise<R> {
		return fetcher<R>(path, 'GET');
	},
	post<R = unknown, D = unknown>(path: string, data?: D): Promise<R> {
		return fetcher<R, D>(path, 'POST', data);
	},
	patch<R = unknown, D = unknown>(path: string, data?: D): Promise<R> {
		return fetcher<R, D>(path, 'PATCH', data);
	},
	delete<R = unknown>(path: string): Promise<R> {
		return fetcher<R>(path, 'DELETE');
	},
};

export { BackendService };
