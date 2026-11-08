<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import type { BlogPost } from '#lib/types/api';

	interface Props {
		posts: BlogPost[] | null;
		error?: string | null;
	}

	let { posts, error }: Props = $props();
</script>

<Card>
	<CardHeader><CardTitle>今日往昔</CardTitle></CardHeader>
	<CardContent class="space-y-4">
		{#if posts?.length}
			{#each posts as post (post.ID)}
				<a
					href={post.permalink}
					target="_blank"
					rel="noopener noreferrer"
					class="block hover:opacity-80"
				>
					<div class="font-medium">
						{post.post_title}
						{#if post.years_ago}<span class="text-muted-foreground text-sm"
								>（{post.years_ago} 年前）</span
							>{/if}
					</div>
					{#if post.post_excerpt}<p class="text-muted-foreground mt-1 line-clamp-2 text-sm">
							{post.post_excerpt}
						</p>{/if}
				</a>
			{/each}
		{:else}
			<p class="text-muted-foreground text-sm">{error ?? '今天没有往昔文章'}</p>
		{/if}
	</CardContent>
</Card>
