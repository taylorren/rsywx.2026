<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '#lib/config/site';

	interface Props {
		title?: string;
		description?: string;
		keywords?: string;
		author?: string;
		image?: string;
		imageAlt?: string;
		type?: 'website' | 'article' | 'book' | 'profile';
		/** See the destructuring default below. */
		appendSiteName?: boolean;
		publishedTime?: string;
		modifiedTime?: string;
		tags?: string[];
		isbn?: string;
		bookAuthor?: string;
		bookTitle?: string;
		noindex?: boolean;
		canonical?: string;
	}

	/*
	 * The card every page falls back to when it has no artwork of its own: a static
	 * 1200x630 file rendered by scripts/make-og-card.py, so its dimensions are known
	 * up front and can be declared to the crawlers below.
	 */
	const DEFAULT_OG_IMAGE = '/images/og-default.png';

	let {
		title = '',
		description = siteConfig.description,
		keywords = siteConfig.keywords,
		author = siteConfig.author,
		image = DEFAULT_OG_IMAGE,
		imageAlt = siteConfig.name,
		type = 'website',
		/**
		 * Turned off when `title` is already a complete line — the homepage names
		 * the whole publication, so appending the site name would repeat it.
		 */
		appendSiteName = true,
		publishedTime,
		modifiedTime,
		tags = [],
		isbn,
		bookAuthor,
		bookTitle,
		noindex = false,
		canonical
	}: Props = $props();

	const siteName = siteConfig.name;
	const siteUrl = siteConfig.url;

	const fullTitle = $derived(
		title ? (appendSiteName ? `${title} | ${siteName}` : title) : siteName
	);
	const currentUrl = $derived(canonical ?? `${siteUrl}${page.url.pathname}`);
	const fullImageUrl = $derived(image.startsWith('http') ? image : `${siteUrl}${image}`);
	const allKeywords = $derived([...new Set([...keywords.split(','), ...tags])].join(','));

	const structuredData = $derived.by(() => {
		if (type === 'book' && bookTitle && bookAuthor) {
			return {
				'@context': 'https://schema.org',
				'@type': 'Book',
				name: bookTitle,
				author: { '@type': 'Person', name: bookAuthor },
				description,
				url: currentUrl,
				image: fullImageUrl,
				...(isbn ? { isbn } : {}),
				...(publishedTime ? { datePublished: publishedTime } : {})
			};
		}

		if (type === 'article') {
			return {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: title,
				description,
				author: { '@type': 'Person', name: author },
				publisher: { '@type': 'Organization', name: siteName },
				url: currentUrl,
				image: fullImageUrl,
				...(publishedTime ? { datePublished: publishedTime } : {}),
				...(modifiedTime ? { dateModified: modifiedTime } : {})
			};
		}

		return {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: siteName,
			description,
			url: siteUrl,
			author: { '@type': 'Person', name: author }
		};
	});

	// Escape '<' so content can never terminate the injected script element.
	const jsonLd = $derived(JSON.stringify(structuredData).replace(/</g, '\\u003c'));
	// Constructed by concatenation so the Svelte / ESLint parsers don't see a
	// literal "<script" opening tag inside the template.
	const ldJsonHtml = $derived(
		'<' + 'script type="application/ld+json">' + jsonLd + '<' + '/script>'
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={allKeywords} />
	<meta name="author" content={author} />
	<meta name="language" content="zh-CN" />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<link rel="canonical" href={currentUrl} />

	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:image" content={fullImageUrl} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if image === DEFAULT_OG_IMAGE}
		<!-- Known size: lets a crawler lay out the card before fetching it. -->
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="zh_CN" />

	{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
	{#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}
	{#each tags as tag, index (index)}
		<meta property="article:tag" content={tag} />
	{/each}
	{#if bookAuthor}<meta property="book:author" content={bookAuthor} />{/if}
	{#if isbn}<meta property="book:isbn" content={isbn} />{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />
	<meta name="theme-color" content="#f59e0b" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- jsonLd is JSON we build and escape '<' in, so it cannot break out of the script element -->
	{@html ldJsonHtml}
</svelte:head>
