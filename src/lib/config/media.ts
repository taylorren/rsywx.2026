// Book covers are served by the frontend itself, from /covers/{bookid}.jpg.
// (The API's `cover_uri` is intentionally not relied upon — see INT-05.)
export const COVERS_BASE = '/covers';

/** Public URL for a book cover, usable on both server and client. */
export function coverUrl(bookid: string): string {
	return `${COVERS_BASE}/${encodeURIComponent(bookid)}.jpg`;
}
