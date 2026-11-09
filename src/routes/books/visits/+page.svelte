<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import SectionHead from '#lib/components/paper/section-head.svelte';
	import VisitRank from '#lib/components/visits/visit-rank.svelte';
	import VisitShelf from '#lib/components/visits/visit-shelf.svelte';
	import VisitSummary from '#lib/components/visits/visit-summary.svelte';
	import VisitTrend from '#lib/components/visits/visit-trend.svelte';
	import { formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const span = $derived(
		data.windowStart && data.until ? `${data.windowStart} ~ ${data.until}` : undefined
	);

	const hotPeak = $derived(data.hot[0]?.total_visits ?? null);
</script>

<Seo
	title="阅览记录"
	description="任氏有无轩藏书的访问记录：今日、近七日、近一月、近半年的访问量，热门与冷门书目，最近阅览与久未问津的书籍。"
/>

<PageHead
	kicker="藏书 · 阅览志"
	title="阅览记录"
	standfirst="每一次翻页都留痕。这里统计本站藏书的访问量，并按热度排出热门与冷门书目。"
	meta={span}
>
	{#snippet action()}
		<a
			href="/books/list"
			class="text-spot hover:border-spot border-b border-transparent font-mono text-xs transition-colors"
		>
			藏书总目 →
		</a>
	{/snippet}
</PageHead>

<section class="mt-8">
	<VisitSummary
		windows={data.windows}
		totalVisits={data.stats?.total_visits ?? null}
		until={data.until}
		error={data.errors.history}
	/>
</section>

<section class="mt-12">
	<SectionHead
		kicker="趋势"
		title="近三十日访问"
		meta={data.trend.length ? `逐日 ${data.trend.length} 日` : undefined}
		heavy
	/>
	<VisitTrend days={data.trend} error={data.errors.history} />
</section>

<!-- Two ends of the same shelf, printed side by side: the most-read and the
     least-read, each ranked with its own bar. -->
<div class="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2">
	<section>
		<SectionHead
			kicker="排行榜 · 热"
			title="热门书籍"
			meta={hotPeak != null ? `榜首 ${formatInt(hotPeak)} 次` : undefined}
		/>
		<VisitRank books={data.hot} tone="hot" error={data.errors.hot} />
	</section>

	<section class="border-rule lg:border-l lg:pl-10">
		<SectionHead kicker="排行榜 · 冷" title="冷门书籍" meta="累计访问最少" />
		<VisitRank books={data.cold} tone="cold" error={data.errors.cold} />
	</section>
</div>

<section class="mt-14">
	<SectionHead kicker="足迹" title="最近阅览" meta="按最近访问时间" heavy />
	<VisitShelf books={data.recent} mode="recent" error={data.errors.recent} />
</section>

<section class="mt-12">
	<SectionHead kicker="尘埃" title="遗忘之书" meta="最久无人问津" heavy />
	<VisitShelf books={data.forgotten} mode="forgotten" error={data.errors.forgotten} />
</section>

<p class="border-rule text-ink-faint mt-12 border-t pt-3 font-mono text-[0.625rem] leading-relaxed">
	访问于打开书籍详情页时记录一次；刷新、悬停预载与预取不计入。两榜条形各自以本榜首位为 100%。
	{#if data.windowStart && data.until}
		四项总量取自 {data.windowStart} 至 {data.until} 的逐日访问记录。
	{/if}
</p>
