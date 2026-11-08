<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button';
	import type { Pagination as PaginationData } from '#lib/types/api';

	interface Props {
		pagination: PaginationData;
		/** Build the href for a given 1-based page number. */
		hrefFor: (page: number) => string;
	}

	let { pagination, hrefFor }: Props = $props();
</script>

{#if pagination.total_pages > 1}
	<div class="mt-10 flex items-center justify-center gap-2">
		<Button
			variant="outline"
			size="sm"
			disabled={pagination.current_page <= 1}
			href={hrefFor(pagination.current_page - 1)}
		>
			<ChevronLeft class="size-4" />上一页
		</Button>
		<span class="text-muted-foreground px-2 text-sm">
			{pagination.current_page} / {pagination.total_pages}
		</span>
		<Button
			variant="outline"
			size="sm"
			disabled={pagination.current_page >= pagination.total_pages}
			href={hrefFor(pagination.current_page + 1)}
		>
			下一页<ChevronRight class="size-4" />
		</Button>
	</div>
{/if}
