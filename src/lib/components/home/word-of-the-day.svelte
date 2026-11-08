<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import type { WordOfTheDay } from '#lib/types/api';

	interface Props {
		word: WordOfTheDay | null;
		error?: string | null;
	}

	let { word, error }: Props = $props();
</script>

<Card>
	<CardHeader><CardTitle>每日一词</CardTitle></CardHeader>
	<CardContent>
		{#if word}
			<div class="text-xl font-semibold">{word.word}</div>
			<p class="text-muted-foreground mt-1 text-sm italic">{word.type}</p>
			<p class="mt-3 text-sm">{word.meaning}</p>
			{#if word.sentence}<p class="text-muted-foreground mt-2 text-sm">{word.sentence}</p>{/if}
		{:else}
			<p class="text-muted-foreground text-sm">{error ?? '暂无数据'}</p>
		{/if}
	</CardContent>
</Card>
