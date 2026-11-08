import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRandomBooks } from '#lib/server/api/endpoints';

/**
 * Returns a fresh batch of random books. Called by the "手气不错" widget's
 * re-roll button; it runs server-side so the API key never reaches the browser.
 */
export const GET: RequestHandler = async ({ fetch, url }) => {
	const parsed = Number(url.searchParams.get('count'));
	const count = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 24) : 6;
	const exclude = (url.searchParams.get('exclude') ?? '').split(',').filter(Boolean);

	try {
		// Ask for a few extra so excluded ids can be dropped and we still return `count`.
		const want = Math.min(count + exclude.length, 24);
		const response = await getRandomBooks(fetch, want, { refresh: true });
		const data = (response.data ?? [])
			.filter((book) => !exclude.includes(book.bookid))
			.slice(0, count);
		return json({ success: true, data });
	} catch (cause) {
		return json(
			{ success: false, message: cause instanceof Error ? cause.message : 'random failed' },
			{ status: 502 }
		);
	}
};
