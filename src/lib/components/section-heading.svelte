<script lang="ts">
	import { cn } from '#lib/utils';

	interface Props {
		title: string;
		/**
		 * A literal Tailwind gradient class pair (e.g. "from-amber-400 to-amber-600").
		 * Kept literal at the call site so Tailwind's scanner can detect it.
		 */
		barClass?: string;
	}
	let { title, barClass = 'from-amber-400 to-amber-600' }: Props = $props();
</script>

<div class="mb-8 flex items-center justify-center">
	<div class="flex flex-1 items-center justify-end">
		<div class={cn('h-1 w-16 rounded-full bg-gradient-to-r', barClass)}></div>
		<div class={cn('ml-2 h-0.5 flex-1 bg-gradient-to-r opacity-60', barClass)}></div>
	</div>
	<div class="mx-8 flex flex-col items-center">
		<h2 class="mb-2 text-3xl font-bold sm:text-4xl">{title}</h2>
		<div class={cn('h-1 w-20 rounded-full bg-gradient-to-r', barClass)}></div>
	</div>
	<div class="flex flex-1 items-center justify-start">
		<div class={cn('mr-2 h-0.5 flex-1 bg-gradient-to-l opacity-60', barClass)}></div>
		<div class={cn('h-1 w-16 rounded-full bg-gradient-to-l', barClass)}></div>
	</div>
</div>
