<script lang="ts">
	import { coverUrl } from '#lib/config/media';
	import { bookByline, bookUrl, cn, formatInt } from '#lib/utils';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		books: BookListItem[];
		/** 「recent」 prints the last visit; 「forgotten」 prints how long it has been shelved. */
		mode?: 'recent' | 'forgotten';
		error?: string | null;
	}

	let { books, mode = 'recent', error = null }: Props = $props();

	const forgotten = $derived(mode === 'forgotten');

	/**
	 * The one fact that matters per shelf: the exact visit time — this is a log,
	 * not a greeting — or how long the book has gone untouched.
	 */
	function note(book: BookListItem): string {
		if (mode === 'forgotten') {
			return book.days_since_visit == null
				? '从未被访问'
				: `尘封 ${formatInt(book.days_since_visit)} 天`;
		}
		return book.last_visited ? book.last_visited.slice(5, 16) : '—';
	}
</script>

<!--
  A shelf of covers rather than a list: 最近阅览 prints the visit time under each
  book, 遗忘之书 prints the same shelf faded and dusted, with the days since the
  last visit set in cinnabar.
-->
{#if books.length}
	<ul class="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
		{#each books as book (book.bookid)}
			<li>
				<a
					href={bookUrl(book.bookid)}
					class="group block"
					title={book.last_visited ? `最近访问 ${book.last_visited.slice(0, 16)}` : undefined}
				>
					<img
						src={coverUrl(book.bookid)}
						alt=""
						loading="lazy"
						decoding="async"
						class={cn(
							'border-rule aspect-3/4 w-full border object-cover transition duration-300',
							forgotten
								? 'opacity-70 grayscale group-hover:opacity-100'
								: 'grayscale group-hover:grayscale-0'
						)}
					/>
					<span
						class="font-display group-hover:text-spot mt-2 line-clamp-2 block text-sm leading-snug font-semibold transition-colors"
					>
						{book.title}
					</span>
					<span class="text-ink-faint mt-0.5 line-clamp-1 block font-mono text-[0.625rem]">
						{bookByline(book)}
					</span>
					<span
						class="text-ink-faint mt-0.5 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-[0.625rem] tabular-nums"
					>
						<span class={forgotten ? 'text-spot' : ''}>{note(book)}</span>
						<span>{formatInt(book.total_visits ?? 0)} 次</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-ink-faint text-sm">{error || '暂无数据'}。</p>
{/if}
