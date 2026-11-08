<script lang="ts">
	import ReadingItem from '#lib/components/reading-item.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import { cn } from '#lib/utils';
	import type { Reading } from '#lib/types/api';

	interface Props {
		title: string;
		readings: Reading[] | null;
		error?: string | null;
		/** Emphasise this card as the headline list (accent ring + coloured title). */
		prominent?: boolean;
		/** Show each date as relative time ("3天前") instead of the raw date. */
		relativeDates?: boolean;
	}

	let { title, readings, error, prominent = false, relativeDates = false }: Props = $props();
</script>

<Card
	class={cn(
		prominent &&
			'to-card dark:to-card bg-gradient-to-br from-emerald-100 shadow-md ring-1 ring-emerald-500/40 dark:from-emerald-950/40'
	)}
>
	<CardHeader>
		<CardTitle class={cn(prominent && 'text-xl font-bold text-emerald-700 dark:text-emerald-300')}
			>{title}</CardTitle
		>
	</CardHeader>
	<CardContent class="space-y-4">
		{#if readings?.length}
			{#each readings as item (item.uri)}
				<ReadingItem {item} relativeDate={relativeDates} />
			{/each}
		{:else}
			<p class="text-muted-foreground text-sm">{error ?? '暂无数据'}</p>
		{/if}
	</CardContent>
</Card>
