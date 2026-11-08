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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
