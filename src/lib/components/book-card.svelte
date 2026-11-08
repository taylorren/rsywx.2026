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

<a
	href={`/books/${book.bookid}`}
	class={cn('group flex flex-col', className)}
	title={`${book.title} · ${book.author}`}
>
	<div class="bg-muted aspect-[3/4] overflow-hidden rounded-md border">
		<img
			src={coverUrl(book.bookid)}
			alt={book.title}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>
	<div class="mt-2 space-y-0.5">
		<div class="line-clamp-1 text-sm font-medium" title={book.title}>{book.title}</div>
		<div class="text-muted-foreground line-clamp-1 text-xs">{bookByline(book)}</div>
		{#if visits != null}
			<div class="text-muted-foreground text-xs">访问 {formatInt(visits)}</div>
		{/if}
	</div>
</a>
