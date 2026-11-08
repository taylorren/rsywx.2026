import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getWordOfTheDay } from '#lib/server/api/endpoints';

/**
 * Returns a fresh word. The backend draws a random row on every call, so the
 * widget's refresh button just asks again; proxying keeps the key server-side.
 */
export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const response = await getWordOfTheDay(fetch, { refresh: true });
		return json({ success: true, data: response.data ?? null });
	} catch (cause) {
		return json(
			{ success: false, message: cause instanceof Error ? cause.message : 'wotd failed' },
			{ status: 502 }
		);
	}
};
