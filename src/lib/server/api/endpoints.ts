import { apiFetch, type ApiFetchOptions } from './client';
import type {
	ApiResponse,
	BlogPost,
	BookDetail,
	BookListItem,
	CurrentWeather,
	LibraryStats,
	QuoteOfTheDay,
	Reading,
	ReadingSummary,
	WordOfTheDay
} from '#lib/types/api';

type Fetch = typeof globalThis.fetch;

/* ----------------------------------------------------------------- System */

export const getStatus = (f: Fetch, o?: ApiFetchOptions) =>
	apiFetch<LibraryStats>(f, '/books/status', o);

/* ------------------------------------------------------------------ Books */

export const getBook = (f: Fetch, bookid: string, o?: ApiFetchOptions) =>
	apiFetch<BookDetail>(f, `/books/${bookid}`, o);

export const getLatestBooks = (f: Fetch, count = 1, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/latest/${count}`, o);

export const getRandomBooks = (f: Fetch, count = 4, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/random/${count}`, o);

export const getLastVisited = (f: Fetch, count = 1, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/last_visited/${count}`, o);

export const getForgotten = (f: Fetch, count = 1, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/forgotten/${count}`, o);

export const getPopular = (f: Fetch, count: number, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/popular/${count}`, o);

export const getUnpopular = (f: Fetch, count: number, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/unpopular/${count}`, o);

/**
 * Search & list. `value` is the catch-all search term; the page is a trailing
 * segment. `-` means "everything" (wildcard).
 */
export const listBooks = (f: Fetch, type: string, value: string, page = 1, o?: ApiFetchOptions) =>
	apiFetch<BookListItem[]>(f, `/books/list/${type}/${encodeURIComponent(value)}/${page}`, o);

/** What the tag write returns: which tags were new, which the book already had. */
export interface TagMutationResult {
	added: string[];
	duplicates: string[];
}

/**
 * Append tags to a book. The backend skips tags the book already carries, so
 * callers never need to send the existing set back.
 */
export async function addBookTags(
	f: Fetch,
	bookid: string,
	tags: string[]
): Promise<TagMutationResult> {
	const response = await apiFetch<unknown>(f, `/books/${bookid}/tags`, {
		method: 'POST',
		body: { tags }
	});

	const read = (key: string): string[] =>
		Array.isArray(response[key]) ? (response[key] as string[]) : [];

	return { added: read('added_tags'), duplicates: read('duplicate_tags') };
}

/**
 * Drop the backend's cached payloads. The API caches book details for 24 hours
 * and does not invalidate them when tags change, so a write must ask for a
 * clear or the next reader sees the old tag list.
 */
export const clearApiCache = (f: Fetch) =>
	apiFetch<unknown>(f, '/admin/cache/clear', { method: 'POST' });

/* --------------------------------------------------------------- Readings */

export const getReadingSummary = (f: Fetch, o?: ApiFetchOptions) =>
	apiFetch<ReadingSummary>(f, '/readings/summary', o);

export const getLatestReadings = (f: Fetch, count = 1, o?: ApiFetchOptions) =>
	apiFetch<Reading[]>(f, `/readings/latest/${count}`, o);

export const getReadingReviews = (f: Fetch, page = 1, o?: ApiFetchOptions) =>
	apiFetch<Reading[]>(f, `/readings/reviews/${page}`, o);

/* ------------------------------------------------------------------ Misc */

export const getWordOfTheDay = (f: Fetch, o?: ApiFetchOptions) =>
	apiFetch<WordOfTheDay>(f, '/misc/wotd', o);

export const getQuoteOfTheDay = (f: Fetch, o?: ApiFetchOptions) =>
	apiFetch<QuoteOfTheDay>(f, '/misc/qotd', o);

export const getCurrentWeather = (f: Fetch, o?: ApiFetchOptions) =>
	apiFetch<CurrentWeather>(f, '/misc/weather/current', o);

/* ------------------------------------------------------------------ Blog */

export const getBlogsToday = (f: Fetch, o?: ApiFetchOptions): Promise<ApiResponse<BlogPost[]>> =>
	apiFetch<BlogPost[]>(f, '/blogs/today', o);

export const getBlogsLatest = (f: Fetch, count = 3, o?: ApiFetchOptions) =>
	apiFetch<BlogPost[]>(f, `/blogs/latest/${count}`, o);
