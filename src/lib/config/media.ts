// Book covers are served by the frontend itself, from /covers/{bookid}.webp.
// (The API's `cover_uri` is intentionally not relied upon — see INT-05.)
// Covers are re-encoded at WebP q90 from the 600px-wide originals: same
// dimensions, ~71% fewer bytes than the JPEGs they replaced.
export const COVERS_BASE = '/covers';

/** Public URL for a book cover, usable on both server and client. */
export function coverUrl(bookid: string): string {
	return `${COVERS_BASE}/${encodeURIComponent(bookid)}.webp`;
}
