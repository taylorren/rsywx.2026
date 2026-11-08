<script lang="ts">
	import { Library } from '@lucide/svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import { formatInt } from '#lib/utils';
	import type { LibraryStats } from '#lib/types/api';

	interface Props {
		stats: LibraryStats | null;
		error?: string | null;
	}

	let { stats, error }: Props = $props();

	const rows = $derived(
		stats
			? [
					{ label: '藏书', value: formatInt(stats.total_books) },
					{ label: '页数', value: formatInt(stats.total_pages) },
					{ label: '千字', value: formatInt(stats.total_kwords) },
					{ label: '访问', value: formatInt(stats.total_visits) }
				]
			: []
	);
</script>

<Card class="overflow-hidden p-0">
	<div class="aspect-4/3 w-full overflow-hidden">
		<img
			src="/images/bookshelf.webp"
			alt=""
			class="h-full w-full object-cover transition-transform hover:scale-105"
		/>
	</div>
	<CardHeader class="px-4 pt-4 pb-1">
		<CardTitle class="flex items-center gap-2 text-lg">
			<Library class="size-5 text-amber-600 dark:text-amber-400" />
			藏书统计
		</CardTitle>
	</CardHeader>
	<CardContent class="space-y-2 px-4 pb-4">
		{#if rows.length}
			<div class="grid grid-cols-2 gap-1 text-center">
				{#each rows as row (row.label)}
					<div>
						<div class="text-base font-bold text-blue-600 dark:text-blue-400">{row.value}</div>
						<div class="text-muted-foreground text-xs">{row.label}</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-center text-sm text-yellow-600 dark:text-yellow-400">
				藏书统计暂不可用{error ? `：${error}` : ''}
			</p>
		{/if}
	</CardContent>
</Card>
