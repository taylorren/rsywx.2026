<script lang="ts">
	import { coverUrl } from '#lib/config/media';
	import { cn, formatRelative, reviewDate } from '#lib/utils';
	import type { Reading } from '#lib/types/api';

	interface Props {
		readings: Reading[] | null;
		error?: string | null;
	}

	let { readings, error = null }: Props = $props();

	const items = $derived(readings ?? []);
	const lead = $derived(items[0] ?? null);
	const rest = $derived(items.slice(1));
</script>

<!--
  Same anatomy as the 今日往昔 department: one lead set as an article — big
  display headline, ruled byline, a small plate beside the standfirst — then
  the rest of the block as a single flowing mid-dot index line. Readings carry
  no excerpt, so the lead's plate is the note's own feature image (book cover
  when the note has none).
-->
{#if lead}
	<article>
		<h3 class="font-display text-3xl leading-tight font-bold sm:text-[2.5rem]">
			<a
				href={lead.uri}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-spot transition-colors"
			>
				{lead.title}
			</a>
		</h3>

		<p
			class="border-rule text-ink-soft mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-b pb-2 font-mono text-xs"
		>
			<span class="text-spot font-semibold">{formatRelative(reviewDate(lead))}</span>
			<span>{reviewDate(lead)}</span>
			<span class="text-ink-faint">评《{lead.book_title}》</span>
		</p>

		<div class="mt-4 flex gap-4">
			<img
				src={lead.feature ?? coverUrl(lead.bookid)}
				alt=""
				loading="lazy"
				decoding="async"
				onerror={(event) => {
					const img = event.currentTarget as HTMLImageElement;
					// External blog art can be slow or gone: fall back to the
					// book cover once, so the plate never prints empty.
					if (img.dataset.fallback) return;
					img.dataset.fallback = '1';
					img.src = coverUrl(lead.bookid);
				}}
				class={cn(
					'border-rule shrink-0 border object-cover grayscale',
					lead.feature ? 'h-24 w-32' : 'h-28 w-20'
				)}
			/>
			<p class="text-ink-soft text-[0.9375rem] leading-[1.9]">
				本篇评《{lead.book_title}》（藏号 {lead.bookid}），全文刊于博客，<a
					href={lead.uri}
					target="_blank"
					rel="noopener noreferrer"
					class="text-spot hover:underline">继续阅读 →</a
				>
			</p>
		</div>
	</article>

	{#if rest.length}
		<p class="border-rule mt-6 border-t pt-3 text-sm leading-[1.9]">
			<span class="kicker text-ink-faint font-mono text-[0.625rem]">同栏其余</span>
			{#each rest as item (item.uri)}
				<span class="text-ink-faint mx-2" aria-hidden="true">·</span>
				<a
					href={item.uri}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-spot font-medium transition-colors">{item.title}</a
				>
				<span class="text-ink-faint ml-1 font-mono text-xs">{reviewDate(item)}</span>
			{/each}
		</p>
	{/if}
{:else}
	<p class="text-ink-faint text-sm">{error ?? '暂无书评'}</p>
{/if}
