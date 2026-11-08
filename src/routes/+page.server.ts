import type { PageServerLoad } from './$types';
import {
	getBlogsToday,
	getCurrentWeather,
	getLastVisited,
	getLatestBooks,
	getLatestReadings,
	getQuoteOfTheDay,
	getRandomBooks,
	getReadingSummary,
	getStatus,
	getWordOfTheDay
} from '#lib/server/api/endpoints';
import { siteConfig } from '#lib/config/site';
import { byIssue, dateline } from '#lib/utils';
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
		wotd,
		qotd,
		weather,
		blogs
	] = await Promise.all([
		settle(getStatus(fetch)),
		settle(getLatestBooks(fetch, 1)),
		settle(getLastVisited(fetch, 1)),
		settle(getRandomBooks(fetch, 8)), // fetch extra so the widget can drop the featured (新入库 / 最近浏览) books
		settle(getReadingSummary(fetch)),
		settle(getLatestReadings(fetch, 8)), // lead + 其他书评 index, one block
		settle(getWordOfTheDay(fetch)),
		settle(getQuoteOfTheDay(fetch)),
		settle(getCurrentWeather(fetch)),
		settle(getBlogsToday(fetch))
	]);

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
		wotd,
		qotd,
		weather,
		blogs
	};
};
