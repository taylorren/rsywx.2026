<script lang="ts">
	import { siteConfig } from '#lib/config/site';
	import { formatInt } from '#lib/utils';
	import type { Dateline } from '#lib/utils';
	import type { LibraryStats } from '#lib/types/api';

	interface Props {
		dateline: Dateline;
		stats?: LibraryStats | null;
	}

	let { dateline: dl, stats = null }: Props = $props();
</script>

<!--
  The masthead replaces the old centred hero entirely: wordmark, epigraph,
  then a double-ruled dateline carrying volume (years in print), issue (day of
  year) and the circulation figure. No buttons, no gradient text, no carousel.
-->
<header class="text-center">
	<!-- Ears: the thin strip above the wordmark -->
	<div
		class="border-rule text-ink-soft flex items-center justify-between gap-4 border-b pb-1.5 font-mono text-[0.6875rem]"
	>
		<span class="kicker">个人数字图书馆</span>
		<span class="hidden sm:inline">每日一期 · 线上发行</span>
		<span class="text-ink-faint">rsywx.net</span>
	</div>

	<h1
		class="font-display text-ink mt-5 text-[clamp(2.75rem,12vw,7rem)] leading-none font-bold tracking-[0.14em]"
	>
		{siteConfig.name}
	</h1>

	<p class="text-ink-soft mt-4 text-sm sm:text-base">
		{siteConfig.motto}
		<span class="text-ink-faint">—— {siteConfig.mottoSource}</span>
	</p>

	<!-- Dateline, closed by a double rule -->
	<div class="border-rule-strong mt-5 border-y-[3px] border-double">
		<div
			class="text-ink-soft flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-1 py-1.5 font-mono text-[0.6875rem] sm:justify-between"
		>
			<span>
				第 <b class="text-ink font-semibold tabular-nums">{dl.volume}</b> 年 · 第
				<b class="text-ink font-semibold tabular-nums">{dl.issue}</b> 期
			</span>

			<span class="text-ink font-semibold">{dl.dateLabel} {dl.weekday}</span>

			{#if stats}
				<span class="hidden sm:inline">
					发行 <b class="text-ink font-semibold tabular-nums">{formatInt(stats.total_books)}</b>
					册 · 累计访问
					<b class="text-ink font-semibold tabular-nums">{formatInt(stats.total_visits)}</b> 次
				</span>
			{/if}
		</div>
	</div>
</header>
