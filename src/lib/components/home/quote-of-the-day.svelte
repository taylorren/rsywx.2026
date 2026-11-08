<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import type { QuoteOfTheDay } from '#lib/types/api';

	interface Props {
		quote: QuoteOfTheDay | null;
		error?: string | null;
	}

	let { quote, error }: Props = $props();
</script>

<Card>
	<CardHeader><CardTitle>每日一句</CardTitle></CardHeader>
	<CardContent>
		{#if quote}
			<blockquote class="text-lg leading-relaxed">“{quote.quote}”</blockquote>
			<p class="text-muted-foreground mt-3 text-sm">— {quote.source}</p>
		{:else}
			<p class="text-muted-foreground text-sm">{error ?? '暂无数据'}</p>
		{/if}
	</CardContent>
</Card>
