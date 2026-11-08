import { RSYWX_API_BASE_URL, RSYWX_API_KEY } from '$app/env/private';
import type { ApiResponse } from '#lib/types/api';

/**
 * Thrown when an API call fails. Carries the upstream HTTP status so callers can
 * render it (or map it to a SvelteKit `error(status, message)`).
 */
export class ApiError extends Error {
	public readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

export interface ApiFetchOptions {
	params?: Record<string, string | number | boolean | undefined | null>;
	/** Ask the backend to recompute cached data (`?refresh=true`). */
	refresh?: boolean;
	/** HTTP method; defaults to GET. */
	method?: 'GET' | 'POST';
	/** JSON body for write calls — sets Content-Type and serialises for you. */
	body?: unknown;
}

type Fetch = typeof globalThis.fetch;

export function buildApiUrl(endpoint: string, params?: ApiFetchOptions['params']): string {
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = new URL(RSYWX_API_BASE_URL + path);

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value === undefined || value === null || value === false || value === '') continue;
			url.searchParams.set(key, String(value));
		}
	}

	return url.toString();
}

/**
 * Server-side API call. Injects the API key, unwraps nothing (returns the
 * `{success, data, cached}` envelope) and throws `ApiError` on non-2xx so a
 * failure is never mistaken for empty data.
 */
export async function apiFetch<T>(
	fetchFn: Fetch,
	endpoint: string,
	options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
	const params = { ...options.params };
	if (options.refresh) params.refresh = true;

	const url = buildApiUrl(endpoint, params);

	const init: RequestInit = {
		method: options.method ?? 'GET',
		headers: {
			'X-API-Key': RSYWX_API_KEY,
			...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
		},
		...(options.body === undefined ? {} : { body: JSON.stringify(options.body) })
	};

	let response: Response;
	try {
		response = await fetchFn(url, init);
	} catch (cause) {
		throw new ApiError(
			503,
			cause instanceof Error ? cause.message : 'Network error contacting the API'
		);
	}

	let body: unknown = null;
	try {
		body = await response.json();
	} catch {
		// leave body as null
	}

	if (!response.ok) {
		const message =
			body &&
			typeof body === 'object' &&
			typeof (body as { message?: unknown }).message === 'string'
				? (body as { message: string }).message
				: `API request failed (HTTP ${response.status})`;
		throw new ApiError(response.status, message);
	}

	if (!body || typeof body !== 'object') {
		throw new ApiError(502, 'Malformed API response');
	}

	return body as ApiResponse<T>;
}
