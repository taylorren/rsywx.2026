<script lang="ts">
	import { cn, formatInt } from '#lib/utils';
	import type { VisitWindow } from '#lib/types/api';

	interface Props {
		/** 今日 / 近七日 / 近一月 / 近半年, cut from one 180-day series. */
		windows: VisitWindow[];
		/** All-time visits (`/books/status`) — the windows only reach back 180 days. */
		totalVisits?: number | null;
		/** The backend's own "today", i.e. when the widest window ends. */
		until?: string | null;
		error?: string | null;
	}

	let { windows, totalVisits = null, until = null, error = null }: Props = $props();

	const peak = $derived(Math.max(1, ...windows.map((window) => window.visits)));

	/** A window's share of the half-year total — never an invented rate. */
	const percent = (visits: number) => Math.round((visits / peak) * 100);

	/** A hairline floor, so a quiet window still prints a bar. */
	const share = (visits: number) => Math.min(100, Math.max(0.8, (visits / peak) * 100));

	/**
	 * Ruled cell in a 2×2 (mobile) / 1×4 (sm and up) table: every cell that
	 * starts a row loses its left rule and padding.
	 */
	const cellClass = (index: number) =>
		cn(
			'min-w-0 pr-4',
			index % 2 === 0 ? 'pl-0' : 'border-rule border-l pl-4',
			index === 0 ? 'sm:pl-0' : 'sm:border-rule sm:border-l sm:pl-4'
		);
</script>

<!--
  阅览总量 as a printed stock table: four ruled cells, figures in display serif,
  and one hairline bar under each to show how the windows accumulate. Nothing
  is rounded, nothing is coloured except the bars.
-->
{#if windows.length}
	<div class="border-rule-strong border-y-[3px] border-double py-5">
		<div class="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
			{#each windows as window, index (window.key)}
				<div class={cellClass(index)}>
					<p class="kicker text-ink-faint font-mono text-[0.625rem]">{window.label}</p>
					<p class="font-display mt-1.5 text-[2rem] leading-none font-bold tabular-nums">
						{formatInt(window.visits)}<span
							class="text-ink-faint ml-1 font-mono text-[0.6875rem] font-normal">次</span
						>
					</p>
					<p class="text-ink-faint mt-1.5 font-mono text-[0.625rem]">
						{#if window.days > 1}
							日均 {formatInt(Math.round(window.visits / window.days))} 次 ·
						{:else}
							{until ?? '当日'} ·
						{/if}
						占半年 {percent(window.visits)}%
					</p>
					<div class="bg-rule/50 mt-2 h-[3px] w-full" aria-hidden="true">
						<div
							class="bg-spot h-full transition-[width] duration-500"
							style={`width:${share(window.visits)}%`}
						></div>
					</div>
				</div>
			{/each}
		</div>

		<div
			class="border-rule text-ink-faint mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t pt-2.5 font-mono text-[0.625rem]"
		>
			<p>条形示各窗口占近半年访问量的比例{until ? ` · 统计截至 ${until}` : ''}</p>
			{#if totalVisits != null}
				<p>
					馆藏累计访问
					<b class="text-ink font-semibold tabular-nums">{formatInt(totalVisits)}</b> 次
				</p>
			{/if}
		</div>
	</div>
{:else}
	<p class="text-ink-faint text-sm">访问统计暂不可用{error ? `：${error}` : ''}。</p>
{/if}
