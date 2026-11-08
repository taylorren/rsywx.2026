<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils';

	interface Props {
		/** Letter-spaced slug in the spot colour, e.g. 新入库. */
		label: string;
		/** Hairline separator below; the last brief in a stack drops it. */
		class?: string;
		children: Snippet;
	}

	let { label, class: className, children }: Props = $props();
</script>

<div class={cn('border-rule border-b py-2.5 first:pt-0 last:border-b-0 last:pb-0', className)}>
	<p class="kicker text-spot font-mono text-[0.625rem] font-semibold">{label}</p>
	<div class="mt-1 text-sm">{@render children()}</div>
</div>
