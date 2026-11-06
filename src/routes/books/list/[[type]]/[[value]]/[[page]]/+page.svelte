<script lang="ts">
	import { untrack } from 'svelte';
	import Seo from '#lib/components/seo.svelte';
	import BookCard from '#lib/components/book-card.svelte';
	import { Button } from '#lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Snapshot the incoming values as the editable form state (initial values only).
	let query = $state(untrack(() => data.displayValue));
	let type = $state(untrack(() => data.type));

	const types = [
		{ value: 'title', label: '书名' },
		{ value: 'author', label: '作者' },
		{ value: 'tags', label: '标签' },
		{ value: 'misc', label: '其他' }
	] as const;

	const pageUrl = (p: number) =>
		`/books/list/${data.type}/${data.displayValue ? encodeURIComponent(data.displayValue) : '-'}/${p}`;

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const value = query.trim();
		if (!value) return;
		window.location.href = `/books/list/${type}/${encodeURIComponent(value)}/1`;
	}
</script>

<Seo
	title={data.displayValue ? `搜索：${data.displayValue}` : '藏书总目'}
	description="任氏有无轩藏书总目，支持按书名、作者、标签检索。"
/>

<h1 class="text-3xl font-bold">藏书总目</h1>

<form onsubmit={submit} class="mt-6 flex flex-wrap items-center gap-3">
	<div class="flex gap-1">
		{#each types as t (t.value)}
			<button
				type="button"
				onclick={() => (type = t.value)}
				class="rounded-md px-3 py-1.5 text-sm transition-colors {type === t.value
					? 'bg-primary text-primary-foreground'
					: 'bg-muted hover:bg-accent'}"
			>
				{t.label}
			</button>
		{/each}
	</div>
	<input
		type="search"
		bind:value={query}
		placeholder="输入检索词…"
		class="bg-background h-9 flex-1 rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
	/>
	<Button type="submit">搜索</Button>
</form>

<div class="text-muted-foreground mt-4 text-sm">
	{data.displayValue ? `“${data.displayValue}” 的检索结果：` : ''}共 {data.pagination.total_results} 条
	· 第 {data.pagination.current_page} / {data.pagination.total_pages} 页
</div>

{#if data.books.length}
	<div class="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
		{#each data.books as book (book.bookid)}
			<BookCard {book} />
		{/each}
	</div>

	{#if data.pagination.total_pages > 1}
		<div class="mt-10 flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={data.pagination.current_page <= 1}
				href={pageUrl(data.pagination.current_page - 1)}
			>
				上一页
			</Button>
			<span class="text-muted-foreground px-2 text-sm">
				{data.pagination.current_page} / {data.pagination.total_pages}
			</span>
			<Button
				variant="outline"
				size="sm"
				disabled={data.pagination.current_page >= data.pagination.total_pages}
				href={pageUrl(data.pagination.current_page + 1)}
			>
				下一页
			</Button>
		</div>
	{/if}
{:else}
	<p class="text-muted-foreground mt-10 text-center">没有找到符合条件的藏书。</p>
{/if}
