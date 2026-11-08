import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getReadingReviews, getReadingSummary } from '#lib/server/api/endpoints';
import { ApiError } from '#lib/server/api/client';

export const load: PageServerLoad = async ({ fetch, params, url, setHeaders }) => {
	const page = Math.max(1, Number(params.page ?? 1) || 1);
	const refresh = url.searchParams.get('refresh') === 'true';

	try {
		const [summary, reviews] = await Promise.all([
			getReadingSummary(fetch, { refresh }),
			getReadingReviews(fetch, page, { refresh })
		]);

		setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });

		const pagination = reviews.pagination ?? {
			current_page: page,
			total_pages: 1,
			total_results: reviews.data?.length ?? 0,
			per_page: 9
		};

		// Same rule as the catalogue: a page beyond the last one does not exist.
		if (page > 1 && pagination.total_pages > 0 && page > pagination.total_pages) {
			throw error(404, '这一页不存在');
		}

		return {
			summary: summary.data ?? null,
			reviews: reviews.data ?? [],
			pagination,
			page
		};
	} catch (cause) {
		if (cause instanceof ApiError) throw error(cause.status, cause.message);
		throw cause;
	}
};
