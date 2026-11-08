<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import FrontPhoto from '#lib/components/layout/front-photo.svelte';
	import Masthead from '#lib/components/layout/masthead.svelte';
	import Box from '#lib/components/paper/box.svelte';
	import SectionHead from '#lib/components/paper/section-head.svelte';
	import LuckyShelf from '#lib/components/home/lucky-shelf.svelte';
	import DailyBoxes from '#lib/components/home/daily-boxes.svelte';
	import LibraryLedger from '#lib/components/home/library-ledger.svelte';
	import NewsBriefs from '#lib/components/home/news-briefs.svelte';
	import ReviewColumn from '#lib/components/home/review-column.svelte';
	import TodayColumn from '#lib/components/home/today-column.svelte';
	import { byReviewDateAsc, byReviewDateDesc, formatInt } from '#lib/utils';
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

	// The two bookends of the reading life: the 3 newest notes and the 5
	// chronologically first ones. Sorted explicitly by publish date so the
	// printed order never depends on whatever order the upstream API returns.
	const latestReviews = $derived(
		[...(data.latestReading.data ?? [])].sort(byReviewDateDesc).slice(0, 3)
	);
	const latestReadingUris = $derived(new Set(latestReviews.map((review) => review.uri)));
	const oldestReviews = $derived(
		[...(data.oldest.data ?? [])]
			.sort(byReviewDateAsc)
			.filter((review) => !latestReadingUris.has(review.uri))
			.slice(0, 5)
	);
	const readingBeginYear = $derived(
		data.readingSummary.data?.reading_period.earliest_date.slice(0, 4)
	);

	// When nothing was published on this day in years past, the newest reading
	// note is promoted to the lead — and then dropped from the index below it.
	const leadReading = $derived(todayCount > 0 ? null : (latestReviews[0] ?? null));
	const reviewIndex = $derived(leadReading ? latestReviews.slice(1) : latestReviews);
</script>

<Seo title="首页" description="任氏有无轩 - 个人数字图书馆，收录藏书、读书笔记、博客文章等内容" />

<Masthead dateline={data.dateline} stats={data.status.data} />

<!-- The showcase window sits directly under the nameplate, above the fold. -->
<section class="mt-8">
	<LuckyShelf books={data.random.data ?? []} error={data.random.error} exclude={featuredBookIds} />
</section>

<!-- Front page: lead column beside a ruled right-hand rail. -->
<div class="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
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
				meta={reviewsWritten != null
					? `累计 ${formatInt(reviewsWritten)} 篇 · 新者在前`
					: '新者在前'}
			/>
			<ReviewColumn readings={reviewIndex} error={data.latestReading.error} />
			<div class="border-rule mt-4 border-t pt-3">
				<a href="/readings" class="text-spot font-mono text-xs hover:underline">全部读书笔记 →</a>
			</div>
		</section>

		{#if oldestReviews.length}
			<section class="mt-10">
				<SectionHead
					kicker="读书 · 档案"
					title="最早书评"
					meta={readingBeginYear ? `开卷 ${readingBeginYear} 年 · 依时顺排` : '依时顺排'}
				/>
				<ReviewColumn readings={oldestReviews} error={data.oldest.error} />
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
