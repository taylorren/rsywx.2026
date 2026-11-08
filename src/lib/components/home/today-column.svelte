<script lang="ts">
	import { coverUrl } from '#lib/config/media';
	import { cn, formatRelative } from '#lib/utils';
	import type { BlogPost, Reading } from '#lib/types/api';

	interface Props {
		/** Posts published on this day in years past. */
		posts: BlogPost[] | null;
		/** Takes the lead when nothing was published on this day. */
		fallback: Reading | null;
		error?: string | null;
	}

	let { posts, fallback, error = null }: Props = $props();

	const lead = $derived(posts?.[0] ?? null);
	const rest = $derived(posts?.slice(1) ?? []);

	// Only break the lead into columns when there is enough copy to fill them.
	const excerpt = $derived(lead?.post_excerpt?.trim() ?? '');
	const wide = $derived(excerpt.length > 90);
</script>

{#if lead}
	<article>
		<h3 class="font-display text-3xl leading-tight font-bold sm:text-[2.5rem]">
			<a
				href={lead.permalink}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-spot transition-colors"
			>
				{lead.post_title}
			</a>
		</h3>

		<p
			class="border-rule text-ink-soft mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-b pb-2 font-mono text-xs"
		>
			<span class="text-spot font-semibold">
				{lead.years_ago ? `${lead.years_ago} 年前的今天` : '今天'}
			</span>
			<span>{lead.post_date.slice(0, 10)}</span>
			<span class="text-ink-faint">{lead.author}</span>
		</p>

		<!-- The drop cap hangs off the first paragraph of the flowing text. -->
		<div class={cn('dropcap mt-4 text-[0.9375rem] leading-[1.9]', wide && 'cols sm:columns-2')}>
			<p>{excerpt || '全文见博客。'}</p>
			<p>
				<a
					href={lead.permalink}
					target="_blank"
					rel="noopener noreferrer"
					class="text-spot hover:underline">阅读全文 →</a
				>
			</p>
		</div>
	</article>

	{#if rest.length}
		<div class="border-rule mt-6 border-t pt-3">
			<p class="kicker text-ink-faint font-mono text-[0.625rem]">同日其他文章</p>
			<ul class="mt-2 space-y-2">
				{#each rest as post (post.ID)}
					<li class="text-sm">
						<a
							href={post.permalink}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-spot font-medium transition-colors">{post.post_title}</a
						>
						<span class="text-ink-faint ml-2 font-mono text-xs">
							{post.years_ago ? `${post.years_ago} 年前` : post.post_date.slice(0, 10)}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{:else if fallback}
	<article>
		<h3 class="font-display text-3xl leading-tight font-bold sm:text-[2.5rem]">
			<a
				href={fallback.uri}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-spot transition-colors"
			>
				{fallback.title}
			</a>
		</h3>

		<p
			class="border-rule text-ink-soft mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-b pb-2 font-mono text-xs"
		>
			<span class="text-spot font-semibold">最新书评</span>
			<span>评《{fallback.book_title}》</span>
			<span>{fallback.datein}</span>
			<span class="text-ink-faint">{formatRelative(fallback.datein)}</span>
		</p>

		<div class="mt-4 flex gap-4">
			<img
				src={coverUrl(fallback.bookid)}
				alt=""
				loading="lazy"
				decoding="async"
				class="border-rule h-28 w-20 shrink-0 border object-cover grayscale"
			/>
			<p class="text-ink-soft text-[0.9375rem] leading-[1.9]">
				今天没有往昔文章。本篇书评全文刊于博客，<a
					href={fallback.uri}
					target="_blank"
					rel="noopener noreferrer"
					class="text-spot hover:underline">继续阅读 →</a
				>
			</p>
		</div>
	</article>
{:else}
	<p class="text-ink-faint text-sm">{error ?? '今天没有往昔文章。'}</p>
{/if}
