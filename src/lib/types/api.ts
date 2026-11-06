// Response contracts for the RSYWX API (v1).
// Mirrors the backend wire types as documented in docs/API.md:
// booleans are real booleans, `price` is number|null, ids are strings, etc.

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	cached?: boolean;
	message?: string;
	pagination?: Pagination;
	[key: string]: unknown;
}

export interface Pagination {
	current_page: number;
	total_pages: number;
	total_results: number;
	per_page: number;
}

/* ------------------------------------------------------------------ Books */

export interface LibraryStats {
	total_books: number;
	total_pages: number;
	total_kwords: number;
	total_visits: number;
}

/** Embedded review on a book detail (minimal schema — its own image + link). */
export interface BookReview {
	id: number;
	title: string;
	datein: string;
	uri: string;
	feature: string | null;
}

/** List item shape (`/books/list`, `/books/latest`, …). */
export interface BookListItem {
	id: number;
	bookid: string;
	title: string;
	author: string;
	translated: boolean;
	copyrighter: string | null;
	region: string;
	location: string;
	purchdate?: string;
	price?: number | null;
	tags?: string[];
	cover_uri: string;
	// last_visited extras
	last_visited?: string;
	visit_country?: string | null;
	total_visits?: number;
	days_since_visit?: number;
	years_ago?: number;
	place_name?: string;
	publisher_name?: string;
}

/** Full book detail (`/books/{bookid}`). */
export interface BookDetail extends BookListItem {
	pubdate?: string;
	printdate?: string;
	ver?: string;
	deco?: string;
	isbn?: string;
	category?: string | null;
	ol?: string | null;
	kword?: number;
	page?: number;
	intro?: string;
	instock?: boolean;
	publisher_name?: string;
	place_name?: string;
	reviews?: BookReview[];
	total_visits?: number;
	last_visited?: string;
}

/* --------------------------------------------------------------- Readings */

export interface ReadingSummary {
	books_read: number;
	reviews_written: number;
	reading_period: {
		earliest_date: string;
		latest_date: string;
		total_days: number;
	};
}

export interface Reading {
	title: string;
	datein: string;
	uri: string;
	feature: string | null;
	bookid: string;
	book_title: string;
	cover_uri: string;
}

/* ------------------------------------------------------------------ Misc */

export interface WordOfTheDay {
	id: number;
	word: string;
	meaning: string;
	sentence: string;
	type: string;
}

export interface QuoteOfTheDay {
	id: number;
	quote: string;
	source: string;
}

/* ------------------------------------------------------------------ Blog */

export interface BlogPost {
	ID: number;
	post_title: string;
	post_name: string;
	post_excerpt: string;
	post_date: string;
	post_status: string;
	author: string;
	years_ago?: number;
	permalink: string;
}

/** Book "on this day" date metadata (differs from the blog one, by design). */
export interface BookDateInfo {
	requested_date: string;
	month_day: string;
	is_today: boolean;
}

/** WordPress "on this day" date metadata. */
export interface BlogDateInfo {
	month: number;
	day: number;
	date_string: string;
	is_today: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination: Pagination;
}
