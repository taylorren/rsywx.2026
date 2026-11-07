<script lang="ts">
	import Seo from '#lib/components/seo.svelte';
	import SectionHeading from '#lib/components/section-heading.svelte';
	import BookCard from '#lib/components/book-card.svelte';
	import Hero from '#lib/components/hero.svelte';
	import ReadingItem from '#lib/components/reading-item.svelte';
	import StatTile from '#lib/components/stat-tile.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const stats = $derived(data.status.data);
	const latestBook = $derived(data.latest.data?.[0] ?? null);
	const lastVisited = $derived(data.lastVisited.data?.[0] ?? null);
	const randomBooks = $derived(data.random.data ?? []);

	const statTiles = $derived(
		stats
			? [
					{ label: '藏书', value: stats.total_books.toLocaleString() },
					{ label: '总页数', value: stats.total_pages.toLocaleString() },
					{ label: '总千字', value: stats.total_kwords.toLocaleString() },
					{ label: '总访问', value: stats.total_visits.toLocaleString() }
				]
			: []
	);

	const readingTiles = $derived(
		data.readingSummary.data
			? [
					{ label: '已读书籍', value: data.readingSummary.data.books_read.toLocaleString() },
					{ label: '读书笔记', value: data.readingSummary.data.reviews_written.toLocaleString() },
					{
						label: '读书天数',
						value: data.readingSummary.data.reading_period.total_days.toLocaleString()
					}
				]
			: []
	);
</script>

<Seo title="首页" description="任氏有无轩 - 个人数字图书馆，收录藏书、读书笔记、博客文章等内容" />

<!-- Hero -->
<Hero />

<!-- 藏书 -->
<section class="mt-20">
	<SectionHeading title="藏书" barClass="from-amber-400 to-amber-600" />

	{#if statTiles.length}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each statTiles as tile (tile.label)}
				<StatTile value={tile.value} label={tile.label} />
			{/each}
		</div>
	{:else}
		<p class="text-muted-foreground text-center text-sm">
			藏书统计暂不可用{data.status.error ? `：${data.status.error}` : ''}
		</p>
	{/if}

	<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card>
			<CardHeader><CardTitle>最新入库</CardTitle></CardHeader>
			<CardContent>
				{#if latestBook}
					<a href={`/books/${latestBook.bookid}`} class="text-lg font-medium hover:underline"
						>{latestBook.title}</a
					>
					<p class="text-muted-foreground mt-1 text-sm">
						{latestBook.author} · {latestBook.location}
					</p>
				{:else}
					<p class="text-muted-foreground text-sm">{data.latest.error ?? '暂无数据'}</p>
				{/if}
			</CardContent>
		</Card>

		<Card>
			<CardHeader><CardTitle>最近浏览</CardTitle></CardHeader>
			<CardContent>
				{#if lastVisited}
					<a href={`/books/${lastVisited.bookid}`} class="text-lg font-medium hover:underline"
						>{lastVisited.title}</a
					>
					<p class="text-muted-foreground mt-1 text-sm">
						{lastVisited.author}
						{#if lastVisited.last_visited}· {lastVisited.last_visited}{/if}
					</p>
				{:else}
					<p class="text-muted-foreground text-sm">{data.lastVisited.error ?? '暂无数据'}</p>
				{/if}
			</CardContent>
		</Card>
	</div>

	<div class="mt-10">
		<h3 class="mb-4 text-center text-lg font-semibold">随机推荐</h3>
		{#if randomBooks.length}
			<div class="grid grid-cols-3 gap-4 sm:grid-cols-6">
				{#each randomBooks as book (book.bookid)}
					<BookCard {book} />
				{/each}
			</div>
		{:else}
			<p class="text-muted-foreground text-center text-sm">{data.random.error ?? '暂无数据'}</p>
		{/if}
		<div class="mt-6 text-center">
			<a href="/books/list" class="text-sm text-amber-600 hover:underline dark:text-amber-400"
				>查看藏书总目 →</a
			>
		</div>
	</div>
</section>

<!-- 读书 -->
<section class="mt-20">
	<SectionHeading title="读书" barClass="from-emerald-400 to-emerald-600" />

	{#if readingTiles.length}
		<div class="grid grid-cols-3 gap-4 text-center">
			{#each readingTiles as tile (tile.label)}
				<StatTile
					value={tile.value}
					label={tile.label}
					valueClass="text-emerald-600 dark:text-emerald-400"
				/>
			{/each}
		</div>
	{:else}
		<p class="text-muted-foreground text-center text-sm">
			{data.readingSummary.error ?? '暂无数据'}
		</p>
	{/if}

	<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card>
			<CardHeader><CardTitle>最新读书</CardTitle></CardHeader>
			<CardContent class="space-y-4">
				{#if data.latestReading.data?.length}
					{#each data.latestReading.data as item (item.uri)}
						<ReadingItem {item} />
					{/each}
				{:else}
					<p class="text-muted-foreground text-sm">{data.latestReading.error ?? '暂无数据'}</p>
				{/if}
			</CardContent>
		</Card>

		<Card>
			<CardHeader><CardTitle>最新书评</CardTitle></CardHeader>
			<CardContent class="space-y-4">
				{#if data.reviews.data?.length}
					{#each data.reviews.data as item (item.uri)}
						<ReadingItem {item} />
					{/each}
				{:else}
					<p class="text-muted-foreground text-sm">{data.reviews.error ?? '暂无数据'}</p>
				{/if}
			</CardContent>
		</Card>
	</div>

	<div class="mt-6 text-center">
		<a href="/readings" class="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
			>更多读书 →</a
		>
	</div>
</section>

<!-- 博客 -->
<section class="mt-20">
	<SectionHeading title="博客" barClass="from-purple-400 to-purple-600" />

	<Card>
		<CardHeader><CardTitle>今日往昔</CardTitle></CardHeader>
		<CardContent class="space-y-4">
			{#if data.blogs.data?.length}
				{#each data.blogs.data as post (post.ID)}
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
				<p class="text-muted-foreground text-sm">{data.blogs.error ?? '今天没有往昔文章'}</p>
			{/if}
		</CardContent>
	</Card>
</section>

<!-- 杂项 -->
<section class="mt-20">
	<SectionHeading title="杂项" barClass="from-blue-400 to-blue-600" />

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card>
			<CardHeader><CardTitle>每日一词</CardTitle></CardHeader>
			<CardContent>
				{#if data.wotd.data}
					<div class="text-xl font-semibold">{data.wotd.data.word}</div>
					<p class="text-muted-foreground mt-1 text-sm italic">{data.wotd.data.type}</p>
					<p class="mt-3 text-sm">{data.wotd.data.meaning}</p>
					{#if data.wotd.data.sentence}<p class="text-muted-foreground mt-2 text-sm">
							{data.wotd.data.sentence}
						</p>{/if}
				{:else}
					<p class="text-muted-foreground text-sm">{data.wotd.error ?? '暂无数据'}</p>
				{/if}
			</CardContent>
		</Card>

		<Card>
			<CardHeader><CardTitle>每日一句</CardTitle></CardHeader>
			<CardContent>
				{#if data.qotd.data}
					<blockquote class="text-lg leading-relaxed">“{data.qotd.data.quote}”</blockquote>
					<p class="text-muted-foreground mt-3 text-sm">— {data.qotd.data.source}</p>
				{:else}
					<p class="text-muted-foreground text-sm">{data.qotd.error ?? '暂无数据'}</p>
				{/if}
			</CardContent>
		</Card>
	</div>
</section>
