<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import { Button } from '#lib/components/ui/button';
	import { Card, CardContent } from '#lib/components/ui/card';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const pageUrl = (p: number) => `/readings/${p}`;
</script>

<Seo title="读书" description="任氏有无轩读书统计与书评。" />

<h1 class="text-3xl font-bold">读书</h1>

{#if data.summary}
	<div class="mt-6 grid grid-cols-3 gap-4 text-center">
		<Card class="gap-0 py-4">
			<CardContent class="px-4">
				<div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
					{data.summary.books_read.toLocaleString()}
				</div>
				<div class="text-muted-foreground mt-1 text-sm">已读书籍</div>
			</CardContent>
		</Card>
		<Card class="gap-0 py-4">
			<CardContent class="px-4">
				<div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
					{data.summary.reviews_written.toLocaleString()}
				</div>
				<div class="text-muted-foreground mt-1 text-sm">读书笔记</div>
			</CardContent>
		</Card>
		<Card class="gap-0 py-4">
			<CardContent class="px-4">
				<div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
					{data.summary.reading_period.total_days.toLocaleString()}
				</div>
				<div class="text-muted-foreground mt-1 text-sm">读书天数</div>
			</CardContent>
		</Card>
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

	{#if data.pagination.total_pages > 1}
		<div class="mt-10 flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={data.pagination.current_page <= 1}
				href={pageUrl(data.pagination.current_page - 1)}>上一页</Button
			>
			<span class="text-muted-foreground px-2 text-sm">
				{data.pagination.current_page} / {data.pagination.total_pages}
			</span>
			<Button
				variant="outline"
				size="sm"
				disabled={data.pagination.current_page >= data.pagination.total_pages}
				href={pageUrl(data.pagination.current_page + 1)}>下一页</Button
			>
		</div>
	{/if}
{:else}
	<p class="text-muted-foreground mt-10 text-center">暂无书评。</p>
{/if}
