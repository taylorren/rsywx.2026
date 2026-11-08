<script lang="ts">
	import { RefreshCw } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import SectionHead from '#lib/components/paper/section-head.svelte';
	import { coverUrl } from '#lib/config/media';
	import { bookByline, cn, formatInt } from '#lib/utils';
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
  手气不错 as a column of classified notices: catalogue number, title, author,
  shelf mark and hit count — the fields a card catalogue actually carries.
-->
<SectionHead kicker="藏书" title="手气不错" meta={`随机 ${items.length} 则`} heavy>
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
	<table class="w-full border-collapse text-sm">
		<thead>
			<tr class="border-rule-strong text-ink-faint border-b text-left font-mono text-[0.6875rem]">
				<th class="py-1.5 pr-3 font-normal">编号</th>
				<th class="py-1.5 pr-3 font-normal">书名</th>
				<th class="hidden py-1.5 pr-3 font-normal sm:table-cell">著者</th>
				<th class="py-1.5 pr-3 text-right font-normal">架位</th>
				<th class="hidden py-1.5 text-right font-normal md:table-cell">访问</th>
			</tr>
		</thead>
		<tbody class="divide-rule divide-y">
			{#each items as book (book.bookid)}
				<tr class="hover:bg-accent/50 group transition-colors">
					<td class="text-ink-faint py-2 pr-3 align-top font-mono text-xs">{book.bookid}</td>
					<td class="py-2 pr-3 align-top">
						<a
							href={`/books/${book.bookid}`}
							class="group-hover:text-spot flex items-start gap-2 font-medium transition-colors"
							title={`${book.title} · ${book.author}`}
						>
							<img
								src={coverUrl(book.bookid)}
								alt=""
								loading="lazy"
								decoding="async"
								class="border-rule h-9 w-7 shrink-0 border object-cover grayscale transition group-hover:grayscale-0"
							/>
							<span class="min-w-0">{book.title}</span>
						</a>
					</td>
					<td class="text-ink-soft hidden py-2 pr-3 align-top text-xs sm:table-cell">
						{bookByline(book)}
					</td>
					<td class="text-ink-faint py-2 pr-3 text-right align-top font-mono text-xs">
						{book.location || '—'}
					</td>
					<td
						class="text-ink-faint hidden py-2 text-right align-top font-mono text-xs tabular-nums md:table-cell"
					>
						{book.total_visits != null ? formatInt(book.total_visits) : '—'}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="border-rule mt-4 flex items-center justify-between gap-4 border-t pt-3">
		{#if failure}<p class="text-spot text-xs">{failure}</p>{/if}
		<a href="/books/list" class="text-spot ml-auto font-mono text-xs hover:underline"
			>查看藏书总目 →</a
		>
	</div>
{:else}
	<p class="text-ink-faint text-sm">{failure || '暂无数据'}</p>
{/if}
