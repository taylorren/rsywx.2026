<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import Ledger from '#lib/components/paper/ledger.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import Pagination from '#lib/components/pagination.svelte';
	import { formatInt, reviewDate } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const pageUrl = (page: number) => `/readings/${page}`;

	const rows = $derived(
		data.summary
			? [
					{ label: '已读书籍', value: formatInt(data.summary.books_read), unit: '册' },
					{ label: '读书笔记', value: formatInt(data.summary.reviews_written), unit: '篇' },
					{
						label: '读书天数',
						value: formatInt(data.summary.reading_period.total_days),
						unit: '天'
					}
				]
			: []
	);
</script>

<Seo title="读书" description="任氏有无轩读书统计与书评。" />

<PageHead
	kicker="读书"
	title="读书笔记"
	standfirst="阅读心得与书评，按刊出时间倒序排列。"
	meta={`共 ${formatInt(data.pagination.total_results)} 篇 · 第 ${data.pagination.current_page} / ${data.pagination.total_pages} 页`}
/>

{#if rows.length && data.summary}
	<div
		class="border-rule mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b pb-6"
	>
		<Ledger {rows} class="w-full max-w-sm" />
		<p class="text-ink-faint font-mono text-xs">
			统计区间 {data.summary.reading_period.earliest_date} ~
			{data.summary.reading_period.latest_date}
		</p>
	</div>
{/if}

{#if data.reviews.length}
	<ul class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.reviews as item (item.uri)}
			<li>
				<a href={item.uri} target="_blank" rel="noopener noreferrer" class="group block">
					{#if item.feature}
						<img
							src={item.feature}
							alt=""
							loading="lazy"
							decoding="async"
							class="border-rule aspect-4/3 w-full border object-cover grayscale transition duration-300 group-hover:grayscale-0"
						/>
					{/if}
					<span
						class="font-display group-hover:text-spot mt-2 block leading-snug font-semibold transition-colors"
					>
						{item.title}
					</span>
					<span class="text-ink-faint mt-0.5 block font-mono text-xs">
						《{item.book_title}》 · {reviewDate(item)}
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<Pagination pagination={data.pagination} hrefFor={pageUrl} />
{:else}
	<p class="text-ink-faint mt-10 text-center">暂无书评。</p>
{/if}
