<script lang="ts">
	import Ledger from '#lib/components/paper/ledger.svelte';
	import { formatInt } from '#lib/utils';
	import type { LibraryStats } from '#lib/types/api';

	interface Props {
		stats: LibraryStats | null;
		error?: string | null;
	}

	let { stats, error = null }: Props = $props();

	const rows = $derived(
		stats
			? [
					{ label: '藏书', value: formatInt(stats.total_books), unit: '册' },
					{ label: '页数', value: formatInt(stats.total_pages), unit: '页' },
					{ label: '字数', value: formatInt(stats.total_kwords), unit: '千字' },
					{ label: '访问', value: formatInt(stats.total_visits), unit: '次' }
				]
			: []
	);
</script>

{#if rows.length}
	<Ledger {rows} />
{:else}
	<p class="text-ink-faint text-sm">藏书统计暂不可用{error ? `：${error}` : ''}</p>
{/if}
