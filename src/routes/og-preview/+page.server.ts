import type { PageServerLoad } from './$types';
import { siteConfig } from '#lib/config/site';

/** One `<meta>` pair, as declared on the audited page. */
export interface OgTag {
	key: string;
	content: string;
}

export interface OgAudit {
	/** The path that was audited, e.g. `/books/00001.html`. */
	path: string;
	status: number;
	title: string | null;
	canonical: string | null;
	tags: OgTag[];
	/** `og:image` as declared — usually an absolute URL on the live domain. */
	imageHref: string | null;
	/** The same image as something this origin can load, so the browser can measure it. */
	imageSrc: string | null;
	jsonLd: string | null;
	error: string | null;
}

const DEFAULT_PATH = '/';

/** Turn a pasted live URL or a bare path into the path this app serves. */
function toPath(raw: string, origin: string): string {
	try {
		const parsed = new URL(raw, origin);
		return `${parsed.pathname}${parsed.search}`;
	} catch {
		return DEFAULT_PATH;
	}
}

/** `<meta property="og:image" content="…">`, whatever the attribute order. */
function readMeta(html: string): OgTag[] {
	const tags: OgTag[] = [];
	for (const raw of html.match(/<meta\b[^>]*>/gi) ?? []) {
		const attrs: Record<string, string> = {};
		for (const [, name, value] of raw.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
			attrs[name.toLowerCase()] = value;
		}
		const key = attrs.property ?? attrs.name;
		if (key && attrs.content !== undefined) {
			if (/^(og|twitter):/i.test(key) || key.toLowerCase() === 'robots') {
				tags.push({ key, content: attrs.content });
			}
		}
	}
	return tags;
}

export const load: PageServerLoad = async ({ url, fetch }): Promise<{ audit: OgAudit }> => {
	const raw = url.searchParams.get('url')?.trim() || DEFAULT_PATH;

	// Accept a pasted live URL (`https://rsywx.net/books/00001.html`) as well as a
	// bare path — either way the audit runs against this app, not the network.
	const path = toPath(raw, url.origin);

	const audit: OgAudit = {
		path,
		status: 0,
		title: null,
		canonical: null,
		tags: [],
		imageHref: null,
		imageSrc: null,
		jsonLd: null,
		error: null
	};

	try {
		const response = await fetch(path);
		audit.status = response.status;

		const html = await response.text();
		audit.title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
		audit.canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1] ?? null;
		audit.tags = readMeta(html);
		audit.jsonLd =
			html.match(/<script type="application\/ld\+json">(.*?)<\/script>/is)?.[1] ?? null;

		audit.imageHref = audit.tags.find((tag) => tag.key === 'og:image')?.content ?? null;
		if (audit.imageHref) {
			// Same-origin copy of the image: the mockups then show exactly the bytes
			// a crawler would fetch, cropped by real CSS instead of a guess. The tag
			// carries the canonical domain (siteConfig.url), so match on that host
			// rather than on whatever origin this dev server happens to run at.
			try {
				const imageUrl = new URL(audit.imageHref, url.origin);
				const siteHost = new URL(siteConfig.url).host;
				audit.imageSrc =
					imageUrl.host === siteHost ? `${imageUrl.pathname}${imageUrl.search}` : imageUrl.href;
			} catch {
				audit.imageSrc = null;
			}
		}
	} catch (cause) {
		audit.error = cause instanceof Error ? cause.message : '抓取失败';
	}

	return { audit };
};
