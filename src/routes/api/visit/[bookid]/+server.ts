import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBook } from '#lib/server/api/endpoints';

/**
 * Records a book visit. Called from the detail page once it mounts on the
 * client, so hover-preloads and refreshes never count (INT-03).
 */
export const POST: RequestHandler = async ({ fetch, params }) => {
	try {
		await getBook(fetch, params.bookid, { params: { visit: true } });
		return json({ success: true });
	} catch (cause) {
		return json(
			{ success: false, message: cause instanceof Error ? cause.message : 'record failed' },
			{ status: 502 }
		);
	}
};
