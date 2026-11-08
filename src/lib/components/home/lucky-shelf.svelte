<script lang="ts">
	import { RefreshCw } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import SectionHead from '#lib/components/paper/section-head.svelte';
	import { coverUrl } from '#lib/config/media';
	import { bookByline, bookUrl, cn, formatInt } from '#lib/utils';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		books: BookListItem[];
		error?: string | null;
		count?: number;
		/** Book ids already shown elsewhere (新入库 / 最近浏览) — never repeat. */
		exclude?: string[];
	}

	let { books, error = null, count = 6, exclude = [] }: Props = $props();

	function pick(list: BookListItem[]): BookListItem[] {
		const drop = new Set(exclude);
		return list.filter((book) => !drop.has(book.bookid)).slice(0, count);
	}

	// Local, refreshable copy of the server-rendered batch.
	let items = $state(untrack(() => pick(books)));
	let loading = $state(false);
	let failure = $state(untrack(() => error));

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

<!--
  手气不错 as a showcase window set directly under the nameplate: one row of
  covers, greyscale until the eye lands on one. The re-roll draws a fresh
  batch from the shelf.
-->
<SectionHead kicker="藏书 · 橱窗" title="手气不错" meta={`随机 ${items.length} 册`} heavy>
	{#snippet action()}
		<button
			type="button"
			onclick={reroll}
			disabled={loading}
			class="hover:text-spot hover:border-spot border-rule-strong inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-xs transition-colors disabled:opacity-50"
		>
			<RefreshCw class={cn('size-3.5', loading && 'animate-spin')} aria-hidden="true" />
			换一批
		</button>
	{/snippet}
</SectionHead>

{#if items.length}
	<ul class="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
		{#each items as book (book.bookid)}
			<li>
				<a href={bookUrl(book.bookid)} class="group block">
					<img
						src={coverUrl(book.bookid)}
						alt=""
						loading="lazy"
						decoding="async"
						class="border-rule aspect-3/4 w-full border object-cover grayscale transition duration-300 group-hover:grayscale-0"
					/>
					<span
						class="font-display group-hover:text-spot mt-2 line-clamp-2 block text-sm leading-snug font-semibold transition-colors"
					>
						{book.title}
					</span>
					<span class="text-ink-faint mt-0.5 line-clamp-1 block font-mono text-[0.6875rem]">
						{bookByline(book)}
					</span>
					<span class="text-ink-faint block font-mono text-[0.6875rem] tabular-nums">
						{book.location || '—'}
						{#if book.total_visits != null}
							· {formatInt(book.total_visits)} 次{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<div class="border-rule mt-4 flex items-center justify-between gap-4 border-t pt-3">
		{#if failure}<p class="text-spot text-xs">{failure}</p>{/if}
		<a href="/books/list" class="text-spot ml-auto font-mono text-xs hover:underline"
			>查看藏书总目 →</a
		>
	</div>
{:else}
	<p class="text-ink-faint text-sm">{failure || '暂无数据'}</p>
{/if}
