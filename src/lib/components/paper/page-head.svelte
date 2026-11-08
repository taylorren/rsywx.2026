<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils';

	interface Props {
		/** Letter-spaced department slug above the title. */
		kicker?: string;
		title: string;
		/** One-sentence standfirst under the title. */
		standfirst?: string;
		/** Mono line for counts / pagination state. */
		meta?: string;
		/** Rendered on the right, level with the meta line. */
		action?: Snippet;
		class?: string;
	}

	let { kicker, title, standfirst, meta, action, class: className }: Props = $props();
</script>

<!-- Interior pages open with a department head closed by a double rule, the
     way a broadsheet opens a section rather than a card-stacked hero. -->
<header class={cn('border-rule-strong border-b-[3px] border-double pb-4', className)}>
	<div class="flex items-end justify-between gap-4">
		<div class="min-w-0">
			{#if kicker}
				<p class="kicker text-spot font-mono text-xs font-semibold">{kicker}</p>
			{/if}
			<h1 class="font-display mt-1 text-4xl font-bold tracking-wide sm:text-5xl">{title}</h1>
			{#if standfirst}
				<p class="text-ink-soft mt-2 max-w-2xl text-base">{standfirst}</p>
			{/if}
		</div>

		{#if meta || action}
			<div class="flex shrink-0 flex-col items-end gap-2 pb-1">
				{#if meta}<p class="text-ink-faint font-mono text-xs">{meta}</p>{/if}
				{#if action}{@render action()}{/if}
			</div>
		{/if}
	</div>
</header>
