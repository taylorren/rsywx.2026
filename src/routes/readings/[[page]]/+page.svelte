<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import Pagination from '#lib/components/pagination.svelte';
	import StatTile from '#lib/components/stat-tile.svelte';
	import { formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const pageUrl = (p: number) => `/readings/${p}`;

	const summaryTiles = $derived(
		data.summary
			? [
					{ label: '已读书籍', value: formatInt(data.summary.books_read) },
					{ label: '读书笔记', value: formatInt(data.summary.reviews_written) },
					{ label: '读书天数', value: formatInt(data.summary.reading_period.total_days) }
				]
			: []
	);
</script>

<Seo title="读书" description="任氏有无轩读书统计与书评。" />

<h1 class="text-3xl font-bold">读书</h1>

{#if data.summary}
	<div class="mt-6 grid grid-cols-3 gap-4 text-center">
		{#each summaryTiles as tile (tile.label)}
			<StatTile
				value={tile.value}
				label={tile.label}
				valueClass="text-emerald-600 dark:text-emerald-400"
			/>
		{/each}
	</div>
	<p class="text-muted-foreground mt-2 text-center text-xs">
		统计区间：{data.summary.reading_period.earliest_date} ~ {data.summary.reading_period
			.latest_date}
	</p>
{/if}

{#if data.reviews.length}
	<div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.reviews as item (item.uri)}
			<a href={item.uri} target="_blank" rel="noopener noreferrer" class="group flex flex-col">
				{#if item.feature}
					<img
						src={item.feature}
						alt={item.title}
						loading="lazy"
						class="aspect-[4/3] w-full rounded-lg border object-cover transition-transform group-hover:scale-[1.02]"
					/>
				{/if}
				<div class="mt-3 font-medium group-hover:underline">{item.title}</div>
				<div class="text-muted-foreground text-sm">{item.datein} · {item.book_title}</div>
			</a>
		{/each}
	</div>

	<Pagination pagination={data.pagination} hrefFor={pageUrl} />
{:else}
	<p class="text-muted-foreground mt-10 text-center">暂无书评。</p>
{/if}
