<script lang="ts">
	import { coverUrl } from '#lib/config/media';
	import { bookByline, bookUrl, cn, formatInt } from '#lib/utils';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		books: BookListItem[];
		/** 「hot」prints the bar in cinnabar; 「cold」in a quiet rule grey. */
		tone?: 'hot' | 'cold';
		error?: string | null;
	}

	let { books, tone = 'hot', error = null }: Props = $props();

	const peak = $derived(Math.max(1, ...books.map((book) => book.total_visits ?? 0)));
</script>

<!--
  One ranked ledger, used for both ends of the shelf: the count sits at the
  right, the row's own background is the bar, so a whole list is legible before
  a single figure is read. Covers print grey and colour up under the pointer.
-->
{#if books.length}
	<ol class="divide-rule divide-y">
		{#each books as book, index (book.bookid)}
			{@const visits = book.total_visits ?? 0}
			<li class="relative overflow-hidden">
				<div
					class={cn('absolute inset-y-0 left-0', tone === 'hot' ? 'bg-spot-soft/70' : 'bg-rule/35')}
					style={`width:${(visits / peak) * 100}%`}
					aria-hidden="true"
				></div>

				<a href={bookUrl(book.bookid)} class="group relative flex items-center gap-3 py-2 pr-1">
					<span class="text-ink-faint w-5 shrink-0 font-mono text-[0.625rem] tabular-nums">
						{String(index + 1).padStart(2, '0')}
					</span>
					<img
						src={coverUrl(book.bookid)}
						alt=""
						loading="lazy"
						decoding="async"
						class="border-rule h-11 w-8 shrink-0 border object-cover grayscale transition duration-300 group-hover:grayscale-0"
					/>
					<span class="min-w-0 flex-1">
						<span
							class="font-display group-hover:text-spot block truncate text-[0.875rem] leading-snug font-semibold transition-colors"
						>
							{book.title}
						</span>
						<span class="text-ink-faint mt-0.5 block truncate font-mono text-[0.625rem]">
							{bookByline(book)}
						</span>
					</span>
					<span
						class="shrink-0 text-right font-mono text-xs font-semibold tabular-nums {tone === 'hot'
							? 'text-spot'
							: 'text-ink-soft'}"
					>
						{formatInt(visits)}
						<span class="text-ink-faint ml-0.5 text-[0.625rem] font-normal">次</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>

	<p class="text-ink-faint mt-2 font-mono text-[0.625rem]">条形以本榜首位为 100%</p>
{:else}
	<p class="text-ink-faint text-sm">{error || '暂无数据'}。</p>
{/if}
