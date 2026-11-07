<script lang="ts">
	import type { Reading } from '#lib/types/api';

	interface Props {
		item: Reading;
	}

	let { item }: Props = $props();
</script>

<a href={item.uri} target="_blank" rel="noopener noreferrer" class="flex gap-3 hover:opacity-80">
	{#if item.feature}
		<img
			src={item.feature}
			alt={item.title}
			loading="lazy"
			class="h-16 w-12 rounded object-cover"
		/>
	{/if}
	<div class="min-w-0">
		<div class="line-clamp-1 font-medium">{item.title}</div>
		<div class="text-muted-foreground text-sm">{item.datein} · {item.book_title}</div>
	</div>
</a>
