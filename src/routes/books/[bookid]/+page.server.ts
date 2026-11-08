import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBook } from '#lib/server/api/endpoints';
import { ApiError } from '#lib/server/api/client';

export const load: PageServerLoad = async ({ fetch, params, url, setHeaders }) => {
	const refresh = url.searchParams.get('refresh') === 'true';

	// /books/00666.html is the only address a book is ever published at. The
	// bare number is not a route we keep alive — it simply does not exist.
	const raw = params.bookid ?? '';
	const match = raw.match(/^(\d{5})\.html$/);
	if (!match) throw error(404, '未找到该书籍，或此书未入架');
	const bookid = match[1];

	try {
		// Read-only: visits are recorded separately (see /api/visit/…) so that
		// hover-preloads and refreshes don't inflate the counter (INT-03).
		const result = await getBook(fetch, bookid, { refresh, params: { visit: false } });
		if (!result.data) throw error(404, '未找到该书籍');

		setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });
		return { book: result.data, cached: result.cached ?? false };
	} catch (cause) {
		if (cause instanceof ApiError) {
			// The API answers "Book not found" for unshelved records (location
			// '--'/'na') as well, so keep the wording useful for a reader.
			if (cause.status === 404) throw error(404, '未找到该书籍，或此书未入架');
			throw error(cause.status, cause.message);
		}
		throw cause;
	}
};
