<script lang="ts">
	import { Dices, RefreshCw } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import BookCard from '#lib/components/book-card.svelte';
	import { Button } from '#lib/components/ui/button';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		books: BookListItem[];
		error?: string | null;
		count?: number;
		/** Book ids already shown elsewhere (最新入库 / 最近浏览) — never repeat them. */
		exclude?: string[];
	}

	let { books, error, count = 6, exclude = [] }: Props = $props();

	function pick(list: BookListItem[]): BookListItem[] {
		const drop = new Set(exclude);
		return list.filter((book) => !drop.has(book.bookid)).slice(0, count);
	}

	// Local, refreshable copy of the server-rendered batch.
	let items = $state(untrack(() => pick(books)));
	let loading = $state(false);
	let failure = $state(untrack(() => error ?? ''));

	async function reroll() {
		loading = true;
		failure = '';
		try {
			const excludeParam = exclude.length
				? `&exclude=${encodeURIComponent(exclude.join(','))}`
				: '';
			const response = await fetch(`/api/random?count=${count}${excludeParam}`);
			const body = await response.json();
			if (response.ok && body?.success && Array.isArray(body.data)) {
				items = body.data;
			} else {
				failure = body?.message ?? '获取失败';
			}
		} catch (cause) {
			failure = cause instanceof Error ? cause.message : '获取失败';
		} finally {
			loading = false;
		}
	}
</script>

<div>
	<div class="mb-4 flex items-center justify-center gap-3">
		<h3 class="flex items-center gap-2 text-lg font-semibold">
			<Dices class="size-5 text-orange-600 dark:text-orange-400" />
			手气不错
		</h3>
		<Button variant="outline" size="sm" onclick={reroll} disabled={loading}>
			<RefreshCw class="size-4" />换一批
		</Button>
	</div>

	{#if items.length}
		<div class="grid grid-cols-3 gap-4 sm:grid-cols-6">
			{#each items as book (book.bookid)}
				<BookCard {book} />
			{/each}
		</div>
	{:else}
		<p class="text-muted-foreground text-center text-sm">{failure || '暂无数据'}</p>
	{/if}

	{#if failure && items.length}
		<p class="text-center text-sm text-red-600 dark:text-red-400">{failure}</p>
	{/if}

	<div class="mt-6 text-center">
		<a href="/books/list" class="text-sm text-amber-600 hover:underline dark:text-amber-400"
			>查看藏书总目 →</a
		>
	</div>
</div>
