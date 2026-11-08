<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import SectionHeading from '#lib/components/section-heading.svelte';
	import Hero from '#lib/components/hero.svelte';
	import BlogToday from '#lib/components/home/blog-today.svelte';
	import LastVisited from '#lib/components/home/last-visited.svelte';
	import LatestBook from '#lib/components/home/latest-book.svelte';
	import QuoteOfTheDay from '#lib/components/home/quote-of-the-day.svelte';
	import RandomBooks from '#lib/components/home/random-books.svelte';
	import ReadingListCard from '#lib/components/home/reading-list-card.svelte';
	import ReadingSummary from '#lib/components/home/reading-summary.svelte';
	import StatusCard from '#lib/components/home/status-card.svelte';
	import WordOfTheDay from '#lib/components/home/word-of-the-day.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Books already featured above (最新入库 / 最近浏览) — kept out of 手气不错.
	const featuredBookIds = $derived(
		[data.latest.data?.[0]?.bookid, data.lastVisited.data?.[0]?.bookid].filter((id): id is string =>
			Boolean(id)
		)
	);

	// 最新书评 = 5 newest; 更早书评 = the next 5 older ones (never overlapping).
	const latestReviews = $derived((data.latestReading.data ?? []).slice(0, 5));
	const latestReadingUris = $derived(new Set(latestReviews.map((r) => r.uri)));
	const olderReviews = $derived(
		[...(data.reviews.data ?? []), ...(data.moreReviews.data ?? [])]
			.filter((review) => !latestReadingUris.has(review.uri))
			.slice(0, 5)
	);
</script>

<Seo title="首页" description="任氏有无轩 - 个人数字图书馆，收录藏书、读书笔记、博客文章等内容" />

<!-- Hero -->
<Hero />

<!-- 藏书 -->
<section class="mt-20">
	<SectionHeading title="藏书" barClass="from-amber-400 to-amber-600" />

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<StatusCard stats={data.status.data} error={data.status.error} />
		<LatestBook book={data.latest.data?.[0] ?? null} error={data.latest.error} />
		<LastVisited book={data.lastVisited.data?.[0] ?? null} error={data.lastVisited.error} />
	</div>

	<div class="mt-10">
		<RandomBooks
			books={data.random.data ?? []}
			error={data.random.error}
			exclude={featuredBookIds}
		/>
	</div>
</section>

<!-- 读书 -->
<section class="mt-20">
	<SectionHeading title="读书" barClass="from-emerald-400 to-emerald-600" />

	<ReadingSummary summary={data.readingSummary.data} error={data.readingSummary.error} />

	<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ReadingListCard
			title="最新书评"
			readings={latestReviews}
			error={data.latestReading.error}
			prominent
		/>
		<ReadingListCard
			title="更早书评"
			readings={olderReviews}
			error={data.reviews.error}
			relativeDates
		/>
	</div>

	<div class="mt-6 text-center">
		<a href="/readings" class="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
			>更多读书 →</a
		>
	</div>
</section>

<!-- 博客 -->
<section class="mt-20">
	<SectionHeading title="博客" barClass="from-purple-400 to-purple-600" />

	<BlogToday posts={data.blogs.data} error={data.blogs.error} />
</section>

<!-- 杂项 -->
<section class="mt-20">
	<SectionHeading title="杂项" barClass="from-blue-400 to-blue-600" />

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<WordOfTheDay word={data.wotd.data} error={data.wotd.error} />
		<QuoteOfTheDay quote={data.qotd.data} error={data.qotd.error} />
	</div>
</section>
