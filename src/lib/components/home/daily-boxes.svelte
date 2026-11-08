<script lang="ts">
	import Box from '#lib/components/paper/box.svelte';
	import type { QuoteOfTheDay, WordOfTheDay } from '#lib/types/api';

	interface Props {
		word: WordOfTheDay | null;
		quote: QuoteOfTheDay | null;
		wordError?: string | null;
		quoteError?: string | null;
	}

	let { word, quote, wordError = null, quoteError = null }: Props = $props();
</script>

<div class="space-y-6">
	<Box head="每日一词" meta={word?.type ?? undefined}>
		{#if word}
			<p class="font-display text-2xl font-bold">{word.word}</p>
			<p class="mt-1.5 text-sm">{word.meaning}</p>
			{#if word.sentence}
				<p class="text-ink-soft border-rule mt-2 border-l-2 pl-2.5 text-xs leading-relaxed italic">
					{word.sentence}
				</p>
			{/if}
		{:else}
			<p class="text-ink-faint text-sm">{wordError ?? '暂无数据'}</p>
		{/if}
	</Box>

	<Box head="每日一句">
		{#if quote}
			<blockquote class="font-display text-[0.9375rem] leading-relaxed">“{quote.quote}”</blockquote>
			<p class="text-ink-faint mt-2 font-mono text-xs">—— {quote.source}</p>
		{:else}
			<p class="text-ink-faint text-sm">{quoteError ?? '暂无数据'}</p>
		{/if}
	</Box>
</div>
