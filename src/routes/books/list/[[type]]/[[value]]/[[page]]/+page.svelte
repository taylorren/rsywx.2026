<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import Seo from '#lib/components/seo.svelte';
	import Pagination from '#lib/components/pagination.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import { Button } from '#lib/components/ui/button';
	import { bookByline, cn, formatInt } from '#lib/utils';
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
	<!-- A pure list: catalogue number, title, byline and shelf mark, one book to
	     a line. The column rule above and between rows is the only furniture. -->
	<div
		class="border-rule-strong text-ink-faint mt-8 hidden border-b-2 pb-1 font-mono text-[0.6875rem] sm:flex sm:items-baseline sm:gap-x-3"
	>
		<span class="w-12 shrink-0">编号</span>
		<span class="flex-1">书名</span>
		<span class="w-64 shrink-0">地区 / 著者 / 译者</span>
		<span>架位</span>
	</div>

	<ul>
		{#each data.books as book (book.bookid)}
			<li>
				<a
					href={`/books/${book.bookid}`}
					class="group hover:bg-accent/40 border-rule flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b py-2.5 transition-colors"
					title={`${book.title} · ${book.author}`}
				>
					<span class="text-ink-faint order-1 w-12 shrink-0 font-mono text-xs tabular-nums">
						{book.bookid}
					</span>
					<span
						class="font-display group-hover:text-spot order-2 min-w-0 flex-1 text-[0.9375rem] leading-snug font-semibold transition-colors"
					>
						{book.title}
					</span>
					<span class="text-ink-faint order-3 shrink-0 font-mono text-xs sm:order-4">
						{book.location || '—'}
					</span>
					<span
						class="text-ink-soft order-4 w-full truncate text-xs sm:order-3 sm:w-64 sm:shrink-0"
					>
						{bookByline(book)}
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<Pagination pagination={data.pagination} hrefFor={pageUrl} />
{:else}
	<p class="text-ink-faint mt-10 text-center">没有找到符合条件的藏书。</p>
{/if}
