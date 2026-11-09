<script lang="ts">
	import { formatInt } from '#lib/utils';
	import type { VisitDay } from '#lib/types/api';

	interface Props {
		/** Chronological daily counts, newest last. */
		days: VisitDay[];
		error?: string | null;
	}

	let { days, error = null }: Props = $props();

	const WIDTH = 1000;
	const HEIGHT = 240;
	const PAD = { top: 14, right: 8, bottom: 30, left: 48 };

	const WEEKDAY_ZH: Record<string, string> = {
		Monday: '周一',
		Tuesday: '周二',
		Wednesday: '周三',
		Thursday: '周四',
		Friday: '周五',
		Saturday: '周六',
		Sunday: '周日'
	};

	/**
	 * The chart is computed, not drawn by hand: bars for every day, five ruled
	 * gridlines, one label every few days. Weekends print in the spot colour so a
	 * month reads at a glance even before the numbers are.
	 */
	const chart = $derived.by(() => {
		const max = Math.max(1, ...days.map((day) => day.visit_count));
		const plotW = WIDTH - PAD.left - PAD.right;
		const plotH = HEIGHT - PAD.top - PAD.bottom;
		const slot = plotW / Math.max(1, days.length);
		const barW = Math.max(2, slot * 0.62);

		const bars = days.map((day, index) => {
			const height = (day.visit_count / max) * plotH;
			return {
				...day,
				x: PAD.left + index * slot + (slot - barW) / 2,
				y: PAD.top + plotH - height,
				w: barW,
				h: Math.max(day.visit_count > 0 ? 2 : 0, height),
				weekend: day.day_of_week === 'Saturday' || day.day_of_week === 'Sunday'
			};
		});

		const ticks = Array.from({ length: 5 }, (_, index) => ({
			value: Math.round((max / 4) * (4 - index)),
			y: PAD.top + (plotH / 4) * index
		}));

		// One date label every few days, and always the last one.
		const step = Math.max(1, Math.ceil(days.length / 6));
		const labels = bars
			.filter((_, index) => index % step === 0 || index === bars.length - 1)
			.map((bar) => ({ key: bar.date, x: bar.x + bar.w / 2, text: bar.date.slice(5) }));

		const total = days.reduce((sum, day) => sum + day.visit_count, 0);
		const peak = bars.reduce<(typeof bars)[number] | null>(
			(top, bar) => (top === null || bar.visit_count > top.visit_count ? bar : top),
			null
		);

		return {
			plotH,
			bars,
			ticks,
			labels,
			total,
			average: days.length ? Math.round(total / days.length) : 0,
			peak
		};
	});
</script>

{#if days.length}
	{@const c = chart}
	<figure>
		<svg
			viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
			class="h-auto w-full"
			role="img"
			aria-label={`近 ${days.length} 日每日访问量柱状图`}
		>
			<!-- Grid: ruled lines with the count set in the left margin. -->
			{#each c.ticks as tick (tick.y)}
				<line
					x1={PAD.left}
					x2={WIDTH - PAD.right}
					y1={tick.y}
					y2={tick.y}
					class="stroke-rule"
					stroke-width="1"
				/>
				<text
					x={PAD.left - 8}
					y={tick.y + 3.5}
					text-anchor="end"
					class="fill-ink-faint font-mono"
					font-size="10">{formatInt(tick.value)}</text
				>
			{/each}

			{#each c.bars as bar (bar.date)}
				<rect
					x={bar.x}
					y={bar.y}
					width={bar.w}
					height={bar.h}
					class={bar.weekend ? 'fill-spot' : 'fill-rule-strong'}
				>
					<title
						>{bar.date}（{WEEKDAY_ZH[bar.day_of_week] ?? bar.day_of_week}）：{formatInt(
							bar.visit_count
						)} 次</title
					>
				</rect>
			{/each}

			<line
				x1={PAD.left}
				x2={WIDTH - PAD.right}
				y1={PAD.top + c.plotH}
				y2={PAD.top + c.plotH}
				class="stroke-rule-strong"
				stroke-width="1"
			/>

			{#each c.labels as label (label.key)}
				<text
					x={label.x}
					y={HEIGHT - 10}
					text-anchor="middle"
					class="fill-ink-faint font-mono"
					font-size="10">{label.text}</text
				>
			{/each}
		</svg>

		<figcaption
			class="border-rule text-ink-faint mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t pt-2 font-mono text-[0.625rem]"
		>
			<p>墨色＝平日 · 朱砂＝周末</p>
			<p>
				日均 <b class="text-ink font-semibold tabular-nums">{formatInt(c.average)}</b> 次
				{#if c.peak}
					· 峰值 {c.peak.date.slice(5)}
					<b class="text-ink font-semibold tabular-nums">{formatInt(c.peak.visit_count)}</b> 次
				{/if}
			</p>
		</figcaption>
	</figure>
{:else}
	<p class="text-ink-faint text-sm">暂无访问记录{error ? `：${error}` : ''}。</p>
{/if}
