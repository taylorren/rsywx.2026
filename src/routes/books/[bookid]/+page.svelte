<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '#lib/components/seo.svelte';
	import Ledger from '#lib/components/paper/ledger.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import { coverUrl } from '#lib/config/media';
	import { bookByline, formatDecimal, formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const book = $derived(data.book);

	// The catalogue entry, rendered as a dotted-leader ledger in two columns.
	const rows = $derived(
		(
			[
				['编号', book.bookid],
				['作者', book.author],
				['译者', book.copyrighter],
				['出版社', book.publisher_name],
				['出版地', book.place_name],
				['ISBN', book.isbn],
				['分类', book.category],
				['版次', book.ver],
				['装帧', book.deco],
				['页数', book.page != null ? `${formatInt(book.page)} 页` : null],
				['字数', book.kword != null ? `${formatInt(book.kword)} 千字` : null],
				['定价', book.price != null ? formatDecimal(book.price) : null],
				['购买日期', book.purchdate],
				['出版日期', book.pubdate],
				['架位', book.location],
				['地区', book.region]
			] as [string, string | null | undefined][]
		)
			.filter(([, value]) => value != null && value !== '')
			.map(([label, value]) => ({ label, value: String(value) }))
	);

	const visitLine = $derived(
		book.total_visits != null
			? `访问 ${formatInt(book.total_visits)} 次${
					book.last_visited ? ` · 最近 ${book.last_visited.slice(0, 10)}` : ''
				}`
			: undefined
	);

	onMount(() => {
		// Record exactly one visit per real page view (not hover-preload).
		fetch(`/api/visit/${book.bookid}`, { method: 'POST' }).catch(() => {});
	});
</script>

<Seo
	title={book.title}
	type="book"
	bookTitle={book.title}
	bookAuthor={book.author}
	isbn={book.isbn}
	description={book.intro?.slice(0, 140)}
	tags={book.tags}
/>

<PageHead
	kicker={`藏书 · 第 ${book.bookid} 号`}
	title={book.title}
	standfirst={bookByline(book)}
	meta={visitLine}
/>

<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
	<figure>
		<img
			src={coverUrl(book.bookid)}
			alt={book.title}
			class="border-rule w-full border object-cover grayscale"
		/>
		{#if book.location}
			<figcaption class="text-ink-faint mt-2 text-center font-mono text-xs">
				架位 {book.location}
			</figcaption>
		{/if}
	</figure>

	<div>
		<Ledger {rows} class="cols gap-8 sm:columns-2" />

		{#if book.tags?.length}
			<p class="border-rule mt-6 border-t pt-3 text-sm">
				<span class="kicker text-ink-faint font-mono text-[0.625rem]">标签</span>
				<span class="ml-2">
					{#each book.tags as tag, index (tag)}
						{#if index > 0}<span class="text-ink-faint"> · </span>{/if}
						<a
							href={`/books/list/tags/${encodeURIComponent(tag)}/1`}
							class="text-spot hover:underline">{tag}</a
						>
					{/each}
				</span>
			</p>
		{/if}
	</div>
</div>

{#if book.intro}
	<section class="border-rule mt-10 border-t pt-6">
		<h2 class="kicker text-ink-faint font-mono text-[0.6875rem]">简介</h2>
		<p class="mt-3 text-[0.9375rem] leading-[1.9] whitespace-pre-line sm:columns-2 sm:gap-9">
			{book.intro}
		</p>
	</section>
{/if}

{#if book.reviews?.length}
	<section class="border-rule mt-10 border-t pt-6">
		<h2 class="kicker text-ink-faint font-mono text-[0.6875rem]">
			相关书评 · {book.reviews.length} 篇
		</h2>

		<ul class="divide-rule mt-3 divide-y">
			{#each book.reviews as review (review.id)}
				<li class="py-3 first:pt-0 last:pb-0">
					<a href={review.uri} target="_blank" rel="noopener noreferrer" class="group flex gap-3">
						{#if review.feature}
							<img
								src={review.feature}
								alt=""
								loading="lazy"
								decoding="async"
								class="border-rule h-16 w-12 shrink-0 border object-cover grayscale transition group-hover:grayscale-0"
							/>
						{/if}
						<span class="min-w-0">
							<span class="group-hover:text-spot block font-medium transition-colors">
								{review.title}
							</span>
							<span class="text-ink-faint font-mono text-xs">{review.datein}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}
