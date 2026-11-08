<script lang="ts">
	import { BookOpen, MapPin, Star } from '@lucide/svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import { coverUrl } from '#lib/config/media';
	import { bookByline } from '#lib/utils';
	import type { BookListItem } from '#lib/types/api';

	interface Props {
		book: BookListItem | null;
		error?: string | null;
	}

	let { book, error }: Props = $props();
</script>

<Card class="overflow-hidden p-0">
	<div
		class="aspect-4/3 w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20"
	>
		{#if book}
			<img
				src={coverUrl(book.bookid)}
				alt={book.title}
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform hover:scale-105"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<BookOpen class="size-12 text-slate-300 dark:text-slate-600" />
			</div>
		{/if}
	</div>
	<CardHeader class="px-4 pt-4 pb-1">
		<CardTitle class="flex items-center gap-2 text-lg">
			<Star class="size-5 text-emerald-600 dark:text-emerald-400" />
			最新入库
		</CardTitle>
	</CardHeader>
	<CardContent class="space-y-2 px-4 pb-4">
		{#if error}
			<p class="text-center text-sm text-red-600 dark:text-red-400">获取失败</p>
		{:else if book}
			<div class="space-y-2">
				<div class="text-center">
					<h3 class="truncate text-base font-bold">
						<a
							href={`/books/${book.bookid}`}
							class="text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						>
							{book.title}
						</a>
					</h3>
					<p class="text-muted-foreground mt-1 text-xs">{bookByline(book)}</p>
					{#if book.location}
						<div class="mt-1 flex justify-center">
							<span
								class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
							>
								<MapPin class="size-3" />{book.location}
							</span>
						</div>
					{/if}
				</div>
				{#if book.purchdate}
					<div class="text-center">
						<div class="text-sm font-medium text-slate-700 dark:text-slate-300">
							{book.purchdate}
						</div>
						<div class="text-muted-foreground text-xs">购买日期</div>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-center text-sm text-yellow-600 dark:text-yellow-400">暂无数据</p>
		{/if}
	</CardContent>
</Card>
