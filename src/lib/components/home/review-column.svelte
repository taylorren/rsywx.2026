<script lang="ts">
	import { cn, formatRelative } from '#lib/utils';
	import type { Reading } from '#lib/types/api';

	interface Props {
		readings: Reading[] | null;
		error?: string | null;
		/** Render dates as relative time ("3天前") instead of the raw date. */
		relativeDates?: boolean;
		/** Break the list into two printed columns when it is long enough. */
		columns?: boolean;
	}

	let { readings, error = null, relativeDates = false, columns = true }: Props = $props();

	const items = $derived(readings ?? []);
	const flow = $derived(columns && items.length > 2);
</script>

{#if items.length}
	<ul class={cn('space-y-3', flow && 'cols sm:columns-2')}>
		{#each items as item (item.uri)}
			<li class="border-rule border-b pb-3 last:border-b-0 last:pb-0">
				<a href={item.uri} target="_blank" rel="noopener noreferrer" class="group block">
					<span
						class="font-display group-hover:text-spot block text-[1.0625rem] leading-snug font-semibold transition-colors"
					>
						{item.title}
					</span>
					<span class="text-ink-faint mt-0.5 block font-mono text-xs">
						《{item.book_title}》 · {relativeDates ? formatRelative(item.datein) : item.datein}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-ink-faint text-sm">{error ?? '暂无书评'}</p>
{/if}
