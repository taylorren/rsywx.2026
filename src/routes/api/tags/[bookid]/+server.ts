import { error, json } from '@sveltejs/kit';
import { RSYWX_TAG_EDIT } from '$app/env/private';
import type { RequestHandler } from './$types';
import { ApiError } from '#lib/server/api/client';
import { addBookTags, clearApiCache } from '#lib/server/api/endpoints';

/** Guard rails for the only write path the frontend exposes. */
const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 30;

/**
 * Adds tags to a book. Runs server-side so the API key stays private, and is
 * deliberately narrow: same-origin only, feature-flagged, and size-capped.
 */
export const POST: RequestHandler = async ({ request, params, url, fetch }) => {
	if (RSYWX_TAG_EDIT !== 'on') throw error(403, '标签编辑已关闭');

	// A personal library's write path should not be drivable from other origins.
	const origin = request.headers.get('origin');
	if (origin && origin !== url.origin) throw error(403, '跨站请求被拒绝');

	const bookid = params.bookid ?? '';
	if (!/^\d{5}$/.test(bookid)) throw error(400, '书号无效');

	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		throw error(400, '请求体须为 JSON');
	}

	const raw = (payload as { tags?: unknown })?.tags;
	if (!Array.isArray(raw)) throw error(400, 'tags 须为字符串数组');

	const tags = [
		...new Set(
			raw
				.filter((tag): tag is string => typeof tag === 'string')
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0 && tag.length <= MAX_TAG_LENGTH)
		)
	].slice(0, MAX_TAGS);

	if (!tags.length) throw error(400, '没有有效标签');

	try {
		const result = await addBookTags(fetch, bookid, tags);
		// The API caches book details and does not bust them on a tag write, so
		// clear it here — otherwise the next page load would still print the old
		// tag list. Best effort: a cache failure must not fail the write.
		await clearApiCache(fetch).catch(() => {});
		return json({ success: true, ...result });
	} catch (cause) {
		if (cause instanceof ApiError) {
			// Backend wording for unshelved records ('--'/'na') is "Book not
			// found"; say something a reader can act on instead.
			if (cause.status === 404) throw error(404, '此书未入架或不存在，无法添加标签');
			throw error(cause.status, cause.message);
		}
		throw cause;
	}
};
