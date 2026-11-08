<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import Seo from '#lib/components/seo.svelte';
	import BookCard from '#lib/components/book-card.svelte';
	import Pagination from '#lib/components/pagination.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import { Button } from '#lib/components/ui/button';
	import { cn, formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Snapshot the incoming values as the editable form state (initial values only).
	let query = $state(untrack(() => data.displayValue));
	let type = $state(untrack(() => data.type));

	const types = [
		{ value: 'title', label: '书名' },
		{ value: 'author', label: '著者' },
		{ value: 'tags', label: '标签' },
		{ value: 'misc', label: '其他' }
	] as const;

	const pageUrl = (page: number) =>
		`/books/list/${data.type}/${data.displayValue ? encodeURIComponent(data.displayValue) : '-'}/${page}`;

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const value = query.trim();
		if (!value) return;
		window.location.href = `/books/list/${type}/${encodeURIComponent(value)}/1`;
	}
</script>

<Seo
	title={data.displayValue ? `检索：${data.displayValue}` : '藏书总目'}
	description="任氏有无轩藏书总目，支持按书名、著者、标签检索。"
/>

<PageHead
	kicker="藏书"
	title={data.displayValue ? `检索「${data.displayValue}」` : '藏书总目'}
	standfirst="按书名、著者、标签或其他字段检索全部藏书。"
	meta={`共 ${formatInt(data.pagination.total_results)} 册 · 第 ${data.pagination.current_page} / ${data.pagination.total_pages} 页`}
/>

<form
	onsubmit={submit}
	class="border-rule mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-b pb-4"
>
	<div class="flex items-center gap-5">
		{#each types as t (t.value)}
			<button
				type="button"
				onclick={() => (type = t.value)}
				class={cn(
					'border-b-2 pb-1 text-sm transition-colors',
					type === t.value
						? 'border-spot text-spot'
						: 'text-ink-soft hover:text-ink border-transparent'
				)}
			>
				{t.label}
			</button>
		{/each}
	</div>

	<div class="flex min-w-48 flex-1 items-center gap-2">
		<Search class="text-ink-faint size-4" aria-hidden="true" />
		<input
			type="search"
			bind:value={query}
			placeholder="输入检索词…"
			aria-label="检索词"
			class="border-rule focus:border-spot placeholder:text-ink-faint w-full border-b bg-transparent py-1 text-sm outline-none"
		/>
	</div>

	<Button type="submit" variant="outline" size="sm">
		<Search class="size-4" />检索
	</Button>
</form>

{#if data.books.length}
	<div class="mt-8 grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 md:grid-cols-6">
		{#each data.books as book (book.bookid)}
			<BookCard {book} />
		{/each}
	</div>

	<Pagination pagination={data.pagination} hrefFor={pageUrl} />
{:else}
	<p class="text-ink-faint mt-10 text-center">没有找到符合条件的藏书。</p>
{/if}
