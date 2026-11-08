<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { Pagination as PaginationData } from '#lib/types/api';

	interface Props {
		pagination: PaginationData;
		/** Build the href for a given 1-based page number. */
		hrefFor: (page: number) => string;
	}

	let { pagination, hrefFor }: Props = $props();

	const current = $derived(pagination.current_page);
	const total = $derived(pagination.total_pages);

	const link = 'hover:text-spot inline-flex items-center gap-1 font-mono text-xs transition-colors';
	const spent = 'text-ink-faint inline-flex items-center gap-1 font-mono text-xs';
</script>

{#if total > 1}
	<nav
		class="border-rule mt-10 flex items-center justify-between gap-4 border-t pt-4"
		aria-label="分页"
	>
		<div class="flex items-center gap-4">
			{#if current > 1}
				<a href={hrefFor(1)} class="hover:text-spot font-mono text-xs transition-colors">首页</a>
				<a href={hrefFor(current - 1)} class={link}>
					<ChevronLeft class="size-3.5" aria-hidden="true" />上一页
				</a>
			{:else}
				<span class={spent}>首页</span>
				<span class={spent}><ChevronLeft class="size-3.5" aria-hidden="true" />上一页</span>
			{/if}
		</div>

		<p class="text-ink-soft font-mono text-xs tabular-nums">
			第 <b class="text-ink font-semibold">{current}</b> / {total} 页 · 共
			{pagination.total_results.toLocaleString('en-US')} 条
		</p>

		<div class="flex items-center gap-4">
			{#if current < total}
				<a href={hrefFor(current + 1)} class={link}>
					下一页<ChevronRight class="size-3.5" aria-hidden="true" />
				</a>
				<a href={hrefFor(total)} class="hover:text-spot font-mono text-xs transition-colors">末页</a
				>
			{:else}
				<span class={spent}>下一页<ChevronRight class="size-3.5" aria-hidden="true" /></span>
				<span class={spent}>末页</span>
			{/if}
		</div>
	</nav>
{/if}
