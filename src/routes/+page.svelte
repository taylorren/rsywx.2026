<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import FrontPhoto from '#lib/components/layout/front-photo.svelte';
	import Masthead from '#lib/components/layout/masthead.svelte';
	import Box from '#lib/components/paper/box.svelte';
	import SectionHead from '#lib/components/paper/section-head.svelte';
	import Classifieds from '#lib/components/home/classifieds.svelte';
	import DailyBoxes from '#lib/components/home/daily-boxes.svelte';
	import LibraryLedger from '#lib/components/home/library-ledger.svelte';
	import NewsBriefs from '#lib/components/home/news-briefs.svelte';
	import ReviewColumn from '#lib/components/home/review-column.svelte';
	import TodayColumn from '#lib/components/home/today-column.svelte';
	import { formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Books already featured above (新入库 / 最近浏览) — kept out of 手气不错.
	const featuredBookIds = $derived(
		[data.latest.data?.[0]?.bookid, data.lastVisited.data?.[0]?.bookid].filter((id): id is string =>
			Boolean(id)
		)
	);

	const reviewsWritten = $derived(data.readingSummary.data?.reviews_written);
	const todayCount = $derived(data.blogs.data?.length ?? 0);

	// 最新书评 = 5 newest; 更早书评 = the next 5 older ones (never overlapping).
	const latestReviews = $derived((data.latestReading.data ?? []).slice(0, 5));
	const latestReadingUris = $derived(new Set(latestReviews.map((review) => review.uri)));
	const olderReviews = $derived(
		[...(data.reviews.data ?? []), ...(data.moreReviews.data ?? [])]
			.filter((review) => !latestReadingUris.has(review.uri))
			.slice(0, 5)
	);

	// When nothing was published on this day in years past, the newest reading
	// note is promoted to the lead — and then dropped from the index below it.
	const leadReading = $derived(todayCount > 0 ? null : (latestReviews[0] ?? null));
	const reviewIndex = $derived(leadReading ? latestReviews.slice(1) : latestReviews);
</script>

<Seo title="首页" description="任氏有无轩 - 个人数字图书馆，收录藏书、读书笔记、博客文章等内容" />

<Masthead dateline={data.dateline} stats={data.status.data} />

<!-- Front page: lead column beside a ruled right-hand rail. -->
<div class="mt-8 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
	<div class="lg:col-span-8">
		<FrontPhoto plate={data.plate} />

		<section class="mt-8">
			<SectionHead
				kicker="博客 · 往日"
				title="今日往昔"
				meta={todayCount ? `${data.dateline.monthDay} · ${todayCount} 篇` : data.dateline.monthDay}
				heavy
			/>
			<TodayColumn posts={data.blogs.data} fallback={leadReading} error={data.blogs.error} />
		</section>

		<section class="mt-10">
			<SectionHead
				kicker="读书"
				title="最新书评"
				meta={reviewsWritten != null ? `累计 ${formatInt(reviewsWritten)} 篇` : undefined}
			/>
			<ReviewColumn readings={reviewIndex} error={data.latestReading.error} />
			<div class="border-rule mt-4 border-t pt-3">
				<a href="/readings" class="text-spot font-mono text-xs hover:underline">全部读书笔记 →</a>
			</div>
		</section>

		{#if olderReviews.length}
			<section class="mt-10">
				<SectionHead kicker="读书" title="更早书评" />
				<ReviewColumn readings={olderReviews} error={data.reviews.error} relativeDates />
			</section>
		{/if}
	</div>

	<aside class="border-rule space-y-6 lg:col-span-4 lg:border-l lg:pl-10">
		<Box head="书讯">
			<NewsBriefs
				latest={data.latest.data?.[0] ?? null}
				visited={data.lastVisited.data?.[0] ?? null}
				error={data.latest.error}
			/>
		</Box>

		<Box head="藏书统计" meta={data.dateline.dateLabel}>
			<LibraryLedger stats={data.status.data} error={data.status.error} />
		</Box>

		<DailyBoxes
			word={data.wotd.data}
			quote={data.qotd.data}
			wordError={data.wotd.error}
			quoteError={data.qotd.error}
		/>
	</aside>
</div>

<section class="mt-12">
	<Classifieds books={data.random.data ?? []} error={data.random.error} exclude={featuredBookIds} />
</section>
