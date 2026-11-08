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

		const pagination = result.pagination ?? {
			current_page: page,
			total_pages: 1,
			total_results: result.data?.length ?? 0,
			per_page: 20
		};

		// A page past the end was never printed — don't print an impossible
		// "第 999 / 92 页" with an empty list.
		if (page > 1 && pagination.total_pages > 0 && page > pagination.total_pages) {
			throw error(404, '这一页不存在');
		}

		return {
			books: result.data ?? [],
			pagination,
			type,
			displayValue: value === '-' ? '' : value
		};
	} catch (cause) {
		if (cause instanceof ApiError) throw error(cause.status, cause.message);
		throw cause;
	}
};
