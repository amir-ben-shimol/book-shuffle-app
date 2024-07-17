export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type ResponseData<T> = {
	readonly data: T;
	readonly message?: string;
};
