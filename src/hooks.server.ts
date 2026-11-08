import type { Handle } from '@sveltejs/kit/hooks';

/**
 * Error responses must never be cached.
 *
 * Pages and assets set their own Cache-Control; a 404 or a 500 is sent without
 * one at all, which permits a browser or an intermediary to cache it
 * heuristically — a typo'd URL or a response captured mid-deploy would then stick
 * around. Everything at >= 400 gets `no-store` here instead.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (response.status >= 400) {
		response.headers.set('cache-control', 'no-store');
	}

	return response;
};
