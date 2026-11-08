// Book covers are served by the frontend itself, from /covers/{bookid}.webp.
// (The API's `cover_uri` is intentionally not relied upon — see INT-05.)
// Covers are re-encoded at WebP q90 from the 600px-wide originals: same
// dimensions, ~71% fewer bytes than the JPEGs they replaced.
//
// NOTE — never derive `bookid` from the numeric `id`. The catalogue mostly
// follows id:111 -> "00111", but the data holds historical exceptions (id 1779
// is missing entirely and the next two rows shift by one: id 1780 -> "01779",
// id 1781 -> "01780", leaving "01781" with neither row nor cover). Everything
// here keys off the `bookid` the API returns.
export const COVERS_BASE = '/covers';

/** Public URL for a book cover, usable on both server and client. */
export function coverUrl(bookid: string): string {
	return `${COVERS_BASE}/${encodeURIComponent(bookid)}.webp`;
}
