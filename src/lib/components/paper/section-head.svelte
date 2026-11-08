<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils';

	interface Props {
		/** Letter-spaced label above the title, e.g. 读书. */
		kicker?: string;
		title: string;
		/** Right-hand note set in mono, e.g. "共 231 篇". */
		meta?: string;
		/** Rendered at the far right of the head (e.g. a re-roll button). */
		action?: Snippet;
		/** Department banner: a double rule instead of a hairline. */
		heavy?: boolean;
		class?: string;
	}

	let { kicker, title, meta, action, heavy = false, class: className }: Props = $props();
</script>

<div class={cn('mb-4', className)}>
	<div class="flex items-end justify-between gap-4">
		<div class="min-w-0">
			{#if kicker}
				<p class="kicker text-ink-faint font-mono text-xs">{kicker}</p>
			{/if}
			<h2 class="font-display text-2xl font-bold tracking-wide sm:text-[1.75rem]">{title}</h2>
		</div>

		<div class="flex shrink-0 items-center gap-3 pb-1">
			{#if meta}<span class="text-ink-faint font-mono text-xs">{meta}</span>{/if}
			{#if action}{@render action()}{/if}
		</div>
	</div>

	<div
		class={heavy
			? 'border-rule-strong mt-2 border-t-[3px] border-double'
			: 'border-rule mt-2 border-t'}
	></div>
</div>
