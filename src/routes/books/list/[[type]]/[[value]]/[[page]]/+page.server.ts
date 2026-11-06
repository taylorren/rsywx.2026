import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listBooks } from '#lib/server/api/endpoints';
import { ApiError } from '#lib/server/api/client';

const TYPES = ['title', 'author', 'tags', 'misc'] as const;
type ListType = (typeof TYPES)[number];

export const load: PageServerLoad = async ({ fetch, params, url, setHeaders }) => {
	const requestedType = params.type as string | undefined;
	const type: ListType = TYPES.includes(requestedType as ListType)
		? (requestedType as ListType)
		: 'title';
	const value = params.value ?? '-';
	const page = Math.max(1, Number(params.page ?? 1) || 1);
	const refresh = url.searchParams.get('refresh') === 'true';

	try {
		const result = await listBooks(fetch, type, value, page, { refresh });
		setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });

		return {
			books: result.data ?? [],
			pagination: result.pagination ?? {
				current_page: page,
				total_pages: 1,
				total_results: result.data?.length ?? 0,
				per_page: 20
			},
			type,
			displayValue: value === '-' ? '' : value
		};
	} catch (cause) {
		if (cause instanceof ApiError) throw error(cause.status, cause.message);
		throw cause;
	}
};
