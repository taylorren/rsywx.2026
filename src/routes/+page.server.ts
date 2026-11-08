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
import { siteConfig } from '#lib/config/site';
import { byIssue, dateline } from '#lib/utils';
import type { ApiResponse, Pagination } from '#lib/types/api';

interface Settled<T> {
	ok: boolean;
	data: T | null;
	error: string | null;
	pagination?: Pagination;
}

/** Never let one failing widget take down the whole page. */
async function settle<T>(promise: Promise<ApiResponse<T>>): Promise<Settled<T>> {
	try {
		const response = await promise;
		return {
			ok: true,
			data: (response.data ?? null) as T | null,
			error: null,
			pagination: response.pagination
		};
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

	// The masthead dateline and today's front-page plate are both resolved from
	// the issue number, on the server — so neither needs a line of client JS.
	const today = dateline();
	const plate = byIssue(siteConfig.frontPage, today.issue);

	const [
		status,
		latest,
		lastVisited,
		random,
		readingSummary,
		latestReading,
		reviews,
		wotd,
		qotd,
		blogs
	] = await Promise.all([
		settle(getStatus(fetch)),
		settle(getLatestBooks(fetch, 1)),
		settle(getLastVisited(fetch, 1)),
		settle(getRandomBooks(fetch, 8)), // fetch extra so the widget can drop the featured (新入库 / 最近浏览) books
		settle(getReadingSummary(fetch)),
		settle(getLatestReadings(fetch, 3)),
		settle(getReadingReviews(fetch, 1)), // page 1 also carries total_pages, needed below
		settle(getWordOfTheDay(fetch)),
		settle(getQuoteOfTheDay(fetch)),
		settle(getBlogsToday(fetch))
	]);

	// The other bookend of the reading life: the chronologically first notes
	// sit on the last page of the reverse-chronological reviews index.
	const totalPages = reviews.pagination?.total_pages ?? 1;
	const oldest = totalPages > 1 ? await settle(getReadingReviews(fetch, totalPages)) : reviews;

	return {
		dateline: today,
		plate,
		fetchedAt: new Date().toISOString(),
		status,
		latest,
		lastVisited,
		random,
		readingSummary,
		latestReading,
		reviews,
		oldest,
		wotd,
		qotd,
		blogs
	};
};
