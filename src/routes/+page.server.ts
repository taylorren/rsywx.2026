import type { PageServerLoad } from './$types';
import {
	getBlogsToday,
	getLastVisited,
	getLatestBooks,
	getLatestReadings,
	getQuoteOfTheDay,
	getRandomBooks,
	getReadingReviews,
	getReadingSummary,
	getStatus,
	getWordOfTheDay
} from '#lib/server/api/endpoints';
import type { ApiResponse } from '#lib/types/api';

interface Settled<T> {
	ok: boolean;
	data: T | null;
	error: string | null;
}

/** Never let one failing widget take down the whole page. */
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

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	// Dynamic but cacheable: let any upstream proxy absorb repeat hits briefly.
	setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });

	const [
		status,
		latest,
		lastVisited,
		random,
		readingSummary,
		latestReading,
		reviews,
		moreReviews,
		wotd,
		qotd,
		blogs
	] = await Promise.all([
		settle(getStatus(fetch)),
		settle(getLatestBooks(fetch, 1)),
		settle(getLastVisited(fetch, 1)),
		settle(getRandomBooks(fetch, 8)), // fetch extra so the widget can drop the featured (最新入库 / 最近浏览) books
		settle(getReadingSummary(fetch)),
		settle(getLatestReadings(fetch, 5)),
		settle(getReadingReviews(fetch, 1)),
		settle(getReadingReviews(fetch, 2)), // a 2nd page so 更早书评 has 5 non-overlapping items
		settle(getWordOfTheDay(fetch)),
		settle(getQuoteOfTheDay(fetch)),
		settle(getBlogsToday(fetch))
	]);

	return {
		fetchedAt: new Date().toISOString(),
		status,
		latest,
		lastVisited,
		random,
		readingSummary,
		latestReading,
		reviews,
		moreReviews,
		wotd,
		qotd,
		blogs
	};
};
