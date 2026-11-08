<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils';

	interface Props {
		/** Boxed-item head, set letter-spaced like a department slug. */
		head?: string;
		/** Right-hand note in the head. */
		meta?: string;
		/** Rendered at the far right of the head (e.g. a refresh button). */
		action?: Snippet;
		class?: string;
		children: Snippet;
	}

	let { head, meta, action, class: className, children }: Props = $props();
</script>

<section class={cn('border-rule-strong border', className)}>
	{#if head}
		<header class="border-rule flex items-baseline justify-between gap-3 border-b px-3 py-1.5">
			<h3 class="kicker font-mono text-xs font-semibold">{head}</h3>
			<div class="flex items-center gap-2">
				{#if meta}<span class="text-ink-faint font-mono text-[0.6875rem]">{meta}</span>{/if}
				{#if action}{@render action()}{/if}
			</div>
		</header>
	{/if}
	<div class="px-3 py-3">{@render children()}</div>
</section>
