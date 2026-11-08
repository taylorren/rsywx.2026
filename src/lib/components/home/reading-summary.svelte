<script lang="ts">
	import StatTile from '#lib/components/stat-tile.svelte';
	import { formatInt } from '#lib/utils';
	import type { ReadingSummary } from '#lib/types/api';

	interface Props {
		summary: ReadingSummary | null;
		error?: string | null;
	}

	let { summary, error }: Props = $props();

	const tiles = $derived(
		summary
			? [
					{ label: '已读书籍', value: formatInt(summary.books_read) },
					{ label: '读书笔记', value: formatInt(summary.reviews_written) },
					{ label: '读书天数', value: formatInt(summary.reading_period.total_days) }
				]
			: []
	);
</script>

{#if tiles.length}
	<div class="grid grid-cols-3 gap-4 text-center">
		{#each tiles as tile (tile.label)}
			<StatTile
				value={tile.value}
				label={tile.label}
				valueClass="text-emerald-600 dark:text-emerald-400"
			/>
		{/each}
	</div>
{:else}
	<p class="text-muted-foreground text-center text-sm">{error ?? '暂无数据'}</p>
{/if}
