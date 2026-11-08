<script lang="ts">
	import { coverUrl } from '#lib/config/media';
	import { bookByline, cn, formatInt } from '#lib/utils';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		book: BookListItem;
		class?: string;
		totalVisits?: number;
	}
	let { book, class: className, totalVisits }: Props = $props();

	const visits = $derived(totalVisits ?? book.total_visits);
</script>

<!-- Covers print greyscale and only gain colour under the cursor, with the
     catalogue number stamped over the foot of the plate. -->
<a
	href={`/books/${book.bookid}`}
	class={cn('group flex flex-col', className)}
	title={`${book.title} · ${book.author}`}
>
	<div class="border-rule relative aspect-3/4 overflow-hidden border">
		<img
			src={coverUrl(book.bookid)}
			alt={book.title}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-[1.03] group-hover:grayscale-0"
		/>
		<span
			class="bg-paper/90 text-ink-faint absolute bottom-0 left-0 px-1 py-0.5 font-mono text-[0.625rem]"
		>
			{book.bookid}
		</span>
	</div>

	<div class="mt-1.5 space-y-0.5">
		<div class="group-hover:text-spot line-clamp-1 text-sm font-medium transition-colors">
			{book.title}
		</div>
		<div class="text-ink-soft line-clamp-1 text-xs">{bookByline(book)}</div>
		<div class="text-ink-faint font-mono text-[0.6875rem]">
			{book.location || '—'}{#if visits != null}
				· {formatInt(visits)}{/if}
		</div>
	</div>
</a>
