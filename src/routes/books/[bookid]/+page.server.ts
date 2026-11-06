import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBook } from '#lib/server/api/endpoints';
import { ApiError } from '#lib/server/api/client';

export const load: PageServerLoad = async ({ fetch, params, url, setHeaders }) => {
	const refresh = url.searchParams.get('refresh') === 'true';

	try {
		// Read-only: visits are recorded separately (see /api/visit/…) so that
		// hover-preloads and refreshes don't inflate the counter (INT-03).
		const result = await getBook(fetch, params.bookid, { refresh, params: { visit: false } });
		if (!result.data) throw error(404, '未找到该书籍');

		setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });
		return { book: result.data, cached: result.cached ?? false };
	} catch (cause) {
		if (cause instanceof ApiError) throw error(cause.status, cause.message);
		throw cause;
	}
};
