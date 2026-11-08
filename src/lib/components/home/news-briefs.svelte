<script lang="ts">
	import Brief from '#lib/components/paper/brief.svelte';
	import { coverUrl } from '#lib/config/media';
	import { bookByline, bookUrl, formatInt, formatRelative } from '#lib/utils';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		latest: BookListItem | null;
		visited: BookListItem | null;
		error?: string | null;
	}

	let { latest, visited, error = null }: Props = $props();
</script>

{#snippet bookBrief(label: string, book: BookListItem, footnote: string)}
	<Brief {label}>
		<a href={bookUrl(book.bookid)} class="group flex gap-3">
			<img
				src={coverUrl(book.bookid)}
				alt=""
				loading="lazy"
				decoding="async"
				class="border-rule h-20 w-14 shrink-0 border object-cover grayscale transition group-hover:grayscale-0"
			/>
			<span class="min-w-0 flex-1">
				<span class="group-hover:text-spot block truncate font-semibold transition-colors">
					{book.title}
				</span>
				<span class="text-ink-soft block truncate text-xs">{bookByline(book)}</span>
				<span class="text-ink-faint mt-1 block font-mono text-[0.6875rem]">{footnote}</span>
			</span>
		</a>
	</Brief>
{/snippet}

{#if latest}
	{@render bookBrief(
		'新入库',
		latest,
		`架位 ${latest.location || '—'} · 入藏 ${latest.purchdate ?? '—'}`
	)}
{/if}

{#if visited}
	{@render bookBrief(
		'最近浏览',
		visited,
		`${formatRelative(visited.last_visited)} · 累计 ${formatInt(visited.total_visits ?? 0)} 次`
	)}
{/if}

{#if !latest && !visited}
	<p class="text-ink-faint text-sm">{error ?? '暂无书讯'}</p>
{/if}
