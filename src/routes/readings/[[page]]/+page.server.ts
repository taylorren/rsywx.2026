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
		return {
			summary: summary.data ?? null,
			reviews: reviews.data ?? [],
			pagination: reviews.pagination ?? {
				current_page: page,
				total_pages: 1,
				total_results: reviews.data?.length ?? 0,
				per_page: 9
			},
			page
		};
	} catch (cause) {
		if (cause instanceof ApiError) throw error(cause.status, cause.message);
		throw cause;
	}
};
