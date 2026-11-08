<script lang="ts">
	import { formatRelative, reviewDate } from '#lib/utils';
	import type { Reading } from '#lib/types/api';

	interface Props {
		readings: Reading[] | null;
		error?: string | null;
		/** Render dates as relative time ("3天前") instead of the raw date. */
		relativeDates?: boolean;
	}

	let { readings, error = null, relativeDates = false }: Props = $props();

	const items = $derived(readings ?? []);
</script>

<!-- A contents-page index: title left, dotted leader, publish date set in
     mono on the right rail so the reverse-chronological order reads at a
     glance instead of hiding at the end of every line. -->
{#if items.length}
	<ul class="space-y-1.5">
		{#each items as item (item.uri)}
			<li>
				<a
					href={item.uri}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-baseline gap-2 py-0.5"
				>
					<span
						class="font-display group-hover:text-spot min-w-0 text-[0.9375rem] leading-snug font-semibold transition-colors"
					>
						{item.title}
						<span class="text-ink-faint ml-1.5 font-mono text-xs font-normal">
							《{item.book_title}》
						</span>
					</span>
					<span class="leader-fill" aria-hidden="true"></span>
					<span class="text-ink-soft shrink-0 font-mono text-xs tabular-nums">
						{relativeDates ? formatRelative(reviewDate(item)) : reviewDate(item)}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-ink-faint text-sm">{error ?? '暂无书评'}</p>
{/if}
