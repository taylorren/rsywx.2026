import type { PageServerLoad } from './$types';
import {
	getForgotten,
	getLastVisited,
	getPopular,
	getStatus,
	getUnpopular,
	getVisitHistory
} from '#lib/server/api/endpoints';
import type { ApiResponse, BookListItem, VisitDay, VisitWindow } from '#lib/types/api';

interface Settled<T> {
	ok: boolean;
	data: T | null;
	error: string | null;
}

/** Never let one failing shelf take down the whole page. */
async function settle<T>(promise: Promise<ApiResponse<T>>): Promise<Settled<T>> {
	try {
		const response = await promise;
		return { ok: true, data: (response.data ?? null) as T | null, error: null };
	} catch (cause) {
		return {
			ok: false,
			data: null,
			error: cause instanceof Error ? cause.message : '请求失败'
		};
	}
}

/**
 * The API has no per-window totals, only a daily series. One 180-day call is
 * therefore enough for all four printed figures — no need to hit it four times.
 */
const HISTORY_DAYS = 180;
/** Days drawn as bars; the four totals still come from the full 180-day series. */
const TREND_DAYS = 30;
const RANK_COUNT = 10;
const SHELF_COUNT = 12;
/** `last_visited` returns one row per visit, not per book — ask for plenty. */
const RECENT_FETCH = 50;

/** Sum the newest `days` entries of a chronological series. */
function sumLast(days: VisitDay[], count: number): number {
	return days.slice(-count).reduce((total, day) => total + day.visit_count, 0);
}

/** Keep the first appearance of each book — the visit log repeats bookids. */
function uniqueBooks(books: BookListItem[]): BookListItem[] {
	const seen = new Set<string>();
	return books.filter((book) => {
		if (seen.has(book.bookid)) return false;
		seen.add(book.bookid);
		return true;
	});
}

function windowsFor(days: VisitDay[]): VisitWindow[] {
	const last = days[days.length - 1];
	return [
		{ key: 'today', label: '今日', days: 1, visits: last?.visit_count ?? 0 },
		{ key: 'week', label: '近七日', days: 7, visits: sumLast(days, 7) },
		{ key: 'month', label: '近一月', days: 30, visits: sumLast(days, 30) },
		{ key: 'halfYear', label: '近半年', days: HISTORY_DAYS, visits: sumLast(days, HISTORY_DAYS) }
	];
}

export const load: PageServerLoad = async ({ fetch, url, setHeaders }) => {
	const refresh = url.searchParams.get('refresh') === 'true';

	const [history, status, hot, cold, recent, forgotten] = await Promise.all([
		settle(getVisitHistory(fetch, HISTORY_DAYS, { refresh })),
		settle(getStatus(fetch, { refresh })),
		settle(getPopular(fetch, RANK_COUNT, { refresh })),
		settle(getUnpopular(fetch, RANK_COUNT, { refresh })),
		settle(getLastVisited(fetch, RECENT_FETCH, { refresh })),
		settle(getForgotten(fetch, SHELF_COUNT, { refresh }))
	]);

	setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });

	const daily = history.data ?? [];
	const lastDay = daily.length ? daily[daily.length - 1] : null;
	const windowStart = daily.length ? daily[Math.max(0, daily.length - HISTORY_DAYS)].date : null;

	return {
		// All four figures on the page are cut from this one series.
		windows: daily.length ? windowsFor(daily) : [],
		until: lastDay?.date ?? null,
		windowStart,
		trend: daily.slice(-TREND_DAYS),
		stats: status.data,
		hot: hot.data ?? [],
		cold: cold.data ?? [],
		recent: uniqueBooks(recent.data ?? []).slice(0, SHELF_COUNT),
		forgotten: forgotten.data ?? [],
		errors: {
			history: history.error,
			status: status.error,
			hot: hot.error,
			cold: cold.error,
			recent: recent.error,
			forgotten: forgotten.error
		}
	};
};
