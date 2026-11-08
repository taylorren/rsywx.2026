<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '#lib/components/seo.svelte';
	import { coverUrl } from '#lib/config/media';
	import { formatDecimal, formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const book = $derived(data.book);

	const meta = $derived(
		(
			[
				['作者', book.author],
				['出版社', book.publisher_name],
				['出版地', book.place_name],
				['ISBN', book.isbn],
				['分类', book.category],
				['版次', book.ver],
				['装帧', book.deco],
				['页数', book.page != null ? formatInt(book.page) : null],
				['千字', book.kword != null ? formatInt(book.kword) : null],
				['定价', book.price != null ? formatDecimal(book.price) : null],
				['购买日期', book.purchdate],
				['出版日期', book.pubdate],
				['藏书位置', book.location],
				['地区', book.region]
			] as [string, string | null | undefined][]
		).filter(([, value]) => value != null && value !== '') as [string, string][]
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

<article class="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
	<div>
		<img src={coverUrl(book.bookid)} alt={book.title} class="w-full rounded-lg border shadow-sm" />
	</div>
	<div>
		<h1 class="text-3xl font-bold">{book.title}</h1>
		<p class="text-muted-foreground mt-2">{book.author}</p>
		{#if book.total_visits != null}
			<p class="text-muted-foreground mt-1 text-sm">
				访问 {formatInt(book.total_visits)}{#if book.last_visited}
					· 最近 {book.last_visited}{/if}
			</p>
		{/if}

		<dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
			{#each meta as [label, value] (label)}
				<div>
					<dt class="text-muted-foreground">{label}</dt>
					<dd class="font-medium">{value}</dd>
				</div>
			{/each}
		</dl>

		{#if book.tags?.length}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each book.tags as tag (tag)}
					<a
						href={`/books/list/tags/${encodeURIComponent(tag)}/1`}
						class="bg-muted hover:bg-accent rounded-full px-3 py-1 text-xs transition-colors"
						>{tag}</a
					>
				{/each}
			</div>
		{/if}
	</div>
</article>

{#if book.intro}
	<section class="mt-10">
		<h2 class="mb-2 text-xl font-semibold">简介</h2>
		<p class="text-sm leading-relaxed whitespace-pre-line">{book.intro}</p>
	</section>
{/if}

{#if book.reviews?.length}
	<section class="mt-10">
		<h2 class="mb-4 text-xl font-semibold">相关书评</h2>
		<ul class="space-y-4">
			{#each book.reviews as review (review.id)}
				<li class="flex gap-3">
					{#if review.feature}
						<img
							src={review.feature}
							alt={review.title}
							loading="lazy"
							class="h-16 w-12 rounded object-cover"
						/>
					{/if}
					<div>
						<a
							href={review.uri}
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium hover:underline">{review.title}</a
						>
						<div class="text-muted-foreground text-sm">{review.datein}</div>
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}
