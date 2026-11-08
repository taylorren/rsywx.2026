import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BookListItem } from '#lib/types/api';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a count with thousands separators, e.g. 1830 -> "1,830".
 * House rule: displayed numbers are either "xxx,xxx" (integers) or "xxx,xxx.00".
 */
export function formatInt(value: number): string {
	return Math.round(value).toLocaleString('en-US');
}

/** Format a number with thousands separators and 2 decimals, e.g. 49 -> "49.00". */
export function formatDecimal(value: number, fractionDigits = 2): string {
	return value.toLocaleString('en-US', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	});
}

/** Shared book byline: 【region】author | translator (translator only if present). */
export function bookByline(book: Pick<BookListItem, 'region' | 'author' | 'copyrighter'>): string {
	return `【${book.region}】${book.author}${book.copyrighter ? ` | ${book.copyrighter}` : ''}`;
}

/** Catalogue search for one name — what an author or translator click should do. */
export function authorSearchUrl(name: string): string {
	return `/books/list/author/${encodeURIComponent(name)}/1`;
}

/**
 * Relative age from an ISO date, e.g. "3天前" / "2个月前" / "1年前".
 * Falls back to the raw string if it can't be parsed.
 */
export function formatRelative(dateStr: string | null | undefined, now: Date = new Date()): string {
	if (!dateStr) return '';
	const then = new Date(dateStr);
	if (Number.isNaN(then.getTime())) return dateStr;

	const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000);
	if (days <= 0) return '今天';
	if (days < 30) return `${days}天前`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months}个月前`;
	return `${Math.floor(days / 365)}年前`;
}

/**
 * The date a reading note was published on the blog. The readings endpoints
 * only carry `datein` — when the log entry was made — which can lag the
 * article by a day; the permalink encodes the true publish date
 * (…/YYYY/MM/DD/slug/). Falls back to `datein` when the URI carries no date.
 */
export function reviewDate(reading: { uri: string; datein: string }): string {
	const match = reading.uri.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
	return match ? `${match[1]}-${match[2]}-${match[3]}` : reading.datein.slice(0, 10);
}

/** Newest-first comparator over review publish dates. */
export function byReviewDateDesc(
	a: { uri: string; datein: string },
	b: { uri: string; datein: string }
): number {
	return reviewDate(b).localeCompare(reviewDate(a));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

/* ------------------------------------------------------------------ *
 * 「今日一页」dateline.
 * A newspaper front page carries a volume and an issue number. Both are
 * resolved in the site's own timezone (never the server's) so that SSR and
 * any client re-render always agree — otherwise hydration would mismatch.
 * ------------------------------------------------------------------ */

export const SITE_TIMEZONE = 'Asia/Shanghai';
export const SITE_FOUNDED = 1989;

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] as const;

export interface SiteDate {
	year: number;
	month: number;
	day: number;
}

/** "Today" on the site's own calendar, independent of the server timezone. */
export function siteToday(now: Date = new Date()): SiteDate {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: SITE_TIMEZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(now);

	const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
	const year = pick('year');
	const month = pick('month');
	const day = pick('day');

	// Intl unavailable or misbehaving: fall back to the server's local date.
	if (!year || !month || !day) {
		return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
	}
	return { year, month, day };
}

export interface Dateline {
	/** Years in print, e.g. 37. */
	volume: number;
	/** Day of the year, used as the issue number, e.g. 312. */
	issue: number;
	/** "2026年11月8日" */
	dateLabel: string;
	/** "11月8日" */
	monthDay: string;
	/** "星期日" */
	weekday: string;
}

/** Masthead dateline: volume (years since founding) + issue (day of year). */
export function dateline(now: Date = new Date()): Dateline {
	const { year, month, day } = siteToday(now);
	const utc = Date.UTC(year, month - 1, day);
	const issue = Math.floor((utc - Date.UTC(year, 0, 1)) / 86_400_000) + 1;

	return {
		volume: Math.max(1, year - SITE_FOUNDED),
		issue,
		dateLabel: `${year}年${month}月${day}日`,
		monthDay: `${month}月${day}日`,
		weekday: WEEKDAYS[new Date(utc).getUTCDay()]
	};
}

/** Deterministically pick one item per issue — no client-side randomness. */
export function byIssue<T>(items: readonly T[], issue: number): T {
	return items[Math.abs(issue) % items.length];
}

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
