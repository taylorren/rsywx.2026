<script lang="ts">
	import { RefreshCw } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import Box from '#lib/components/paper/box.svelte';
	import { cn } from '#lib/utils';
	import type { QuoteOfTheDay, WordOfTheDay } from '#lib/types/api';

	interface Props {
		word: WordOfTheDay | null;
		quote: QuoteOfTheDay | null;
		wordError?: string | null;
		quoteError?: string | null;
	}

	let { word, quote, wordError = null, quoteError = null }: Props = $props();

	// Each box keeps its own copy so a refresh swaps only that one.
	let currentWord = $state(untrack(() => word));
	let currentQuote = $state(untrack(() => quote));
	let wordBusy = $state(false);
	let quoteBusy = $state(false);
	let wordFailure = $state(untrack(() => wordError));
	let quoteFailure = $state(untrack(() => quoteError));

	/** Ask the server for another random draw; the key never leaves the server. */
	async function redraw(kind: 'word' | 'quote') {
		if (kind === 'word') {
			wordBusy = true;
			wordFailure = '';
		} else {
			quoteBusy = true;
			quoteFailure = '';
		}
		try {
			const response = await fetch(`/api/${kind === 'word' ? 'wotd' : 'qotd'}`);
			const body = await response.json();
			if (response.ok && body?.success && body.data) {
				if (kind === 'word') currentWord = body.data;
				else currentQuote = body.data;
			} else {
				const message = body?.message ?? '获取失败';
				if (kind === 'word') wordFailure = message;
				else quoteFailure = message;
			}
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : '获取失败';
			if (kind === 'word') wordFailure = message;
			else quoteFailure = message;
		} finally {
			if (kind === 'word') wordBusy = false;
			else quoteBusy = false;
		}
	}

	/** Small mono button for a box head. */
	const redrawButton =
		'hover:text-spot text-ink-faint inline-flex items-center gap-1 font-mono text-[0.625rem] transition-colors disabled:opacity-50';
</script>

<div class="space-y-6">
	<Box head="每日一词">
		{#snippet action()}
			<button
				type="button"
				class={redrawButton}
				onclick={() => redraw('word')}
				disabled={wordBusy}
				aria-label="换一个词"
				title="换一个词"
			>
				<RefreshCw class={cn('size-3', wordBusy && 'animate-spin')} aria-hidden="true" />
			</button>
		{/snippet}

		{#if currentWord}
			<p class="font-display text-2xl font-bold">{currentWord.word}</p>
			<p class="text-ink-faint mt-0.5 font-mono text-xs italic">{currentWord.type}</p>
			<p class="mt-1.5 text-sm">{currentWord.meaning}</p>
			{#if currentWord.sentence}
				<p class="text-ink-soft border-rule mt-2 border-l-2 pl-2.5 text-xs leading-relaxed italic">
					{currentWord.sentence}
				</p>
			{/if}
		{:else}
			<p class="text-ink-faint text-sm">{wordFailure || '暂无数据'}</p>
		{/if}
		{#if wordFailure && currentWord}
			<p class="text-spot mt-2 text-xs">{wordFailure}</p>
		{/if}
	</Box>

	<Box head="每日一句">
		{#snippet action()}
			<button
				type="button"
				class={redrawButton}
				onclick={() => redraw('quote')}
				disabled={quoteBusy}
				aria-label="换一句"
				title="换一句"
			>
				<RefreshCw class={cn('size-3', quoteBusy && 'animate-spin')} aria-hidden="true" />
			</button>
		{/snippet}

		{#if currentQuote}
			<blockquote class="font-display text-[0.9375rem] leading-relaxed whitespace-pre-line">
				“{currentQuote.quote}”
			</blockquote>
			<p class="text-ink-faint mt-2 font-mono text-xs">—— {currentQuote.source}</p>
		{:else}
			<p class="text-ink-faint text-sm">{quoteFailure || '暂无数据'}</p>
		{/if}
		{#if quoteFailure && currentQuote}
			<p class="text-spot mt-2 text-xs">{quoteFailure}</p>
		{/if}
	</Box>
</div>
