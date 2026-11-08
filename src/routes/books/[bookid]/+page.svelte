<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { Loader } from '@lucide/svelte';
	import Seo from '#lib/components/seo.svelte';
	import Ledger from '#lib/components/paper/ledger.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import SectionHead from '#lib/components/paper/section-head.svelte';
	import { coverUrl } from '#lib/config/media';
	import { siteConfig } from '#lib/config/site';
	import { authorSearchUrl, formatDecimal, formatInt } from '#lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const book = $derived(data.book);

	// The catalogue entry. Author / translator / region live on the byline above
	// (the author as a search link), and the shelf mark is set as a stamp beside
	// the cover, so neither is repeated here.
	const rows = $derived(
		(
			[
				['编号', book.bookid],
				['出版社', book.publisher_name],
				['出版地', book.place_name],
				['ISBN', book.isbn],
				['分类', book.category],
				['版次', book.ver],
				['装帧', book.deco],
				['页数', book.page != null ? `${formatInt(book.page)} 页` : null],
				['字数', book.kword != null ? `${formatInt(book.kword)} 千字` : null],
				['定价', book.price != null ? formatDecimal(book.price) : null],
				['购买日期', book.purchdate],
				['出版日期', book.pubdate]
			] as [string, string | null | undefined][]
		)
			.filter(([, value]) => value != null && value !== '')
			.map(([label, value]) => ({ label, value: String(value) }))
	);

	/** Full timestamp, minute precision — a visit log without the clock is useless. */
	const lastVisit = $derived(book.last_visited ? book.last_visited.slice(0, 16) : null);
	const visits = $derived(book.total_visits != null ? formatInt(book.total_visits) : null);

	const visitLine = $derived(
		[visits ? `访问 ${visits} 次` : null, lastVisit ? `最近 ${lastVisit}` : null]
			.filter(Boolean)
			.join(' · ') || undefined
	);

	const reviewCount = $derived(book.reviews?.length ?? 0);

	// Local copy so a freshly added tag shows up without a reload.
	let tags = $state(untrack(() => book.tags ?? []));
	let tagInput = $state('');
	let tagBusy = $state(false);
	let tagNote = $state('');
	let tagError = $state(false);

	/** Same limits the write route enforces — mirrored so nothing is dropped silently. */
	const MAX_TAGS = 10;
	const MAX_TAG_LENGTH = 30;

	/** Space is the only delimiter (any whitespace run, incl. the full-width space). */
	function splitTags(value: string): string[] {
		return value
			.split(/\s+/)
			.map((tag) => tag.trim())
			.filter(Boolean);
	}

	async function saveTags() {
		const wanted = splitTags(tagInput);
		if (!wanted.length) return;

		// Option A: send what is legal, then report exactly what was ignored and
		// why — never drop a tag without saying so.
		const tooLong = wanted.filter((tag) => tag.length > MAX_TAG_LENGTH);
		const unique = [...new Set(wanted.filter((tag) => tag.length <= MAX_TAG_LENGTH))];
		const overflow = unique.slice(MAX_TAGS);
		const toSend = unique.slice(0, MAX_TAGS);

		tagError = false;
		tagNote = '';

		if (!toSend.length) {
			tagError = true;
			tagNote = `没有可提交的标签：单个标签不得超过 ${MAX_TAG_LENGTH} 字`;
			return;
		}

		tagBusy = true;
		try {
			const response = await fetch(`/api/tags/${book.bookid}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ tags: toSend })
			});
			const body = await response.json().catch(() => null);

			if (!response.ok || !body?.success) {
				tagError = true;
				tagNote = body?.message ?? `保存失败（HTTP ${response.status}）`;
				return;
			}

			const added: string[] = body.added ?? [];
			const duplicates: string[] = body.duplicates ?? [];
			tags = [...tags, ...added.filter((tag) => !tags.includes(tag))];
			tagInput = '';

			const ignored = [
				tooLong.length ? `超长：${tooLong.join('、')}` : '',
				overflow.length ? `超出 ${MAX_TAGS} 个：${overflow.join('、')}` : ''
			].filter(Boolean);

			tagNote = [
				added.length ? `已添加：${added.join('、')}` : '',
				duplicates.length ? `已存在：${duplicates.join('、')}` : '',
				ignored.length ? `已忽略 —— ${ignored.join('；')}` : ''
			]
				.filter(Boolean)
				.join('；');
		} catch (cause) {
			tagError = true;
			tagNote = cause instanceof Error ? cause.message : '网络错误';
		} finally {
			tagBusy = false;
		}
	}

	/** Intro is author's prose: split on blank lines, indent each paragraph. */
	const introParagraphs = $derived(
		(book.intro ?? '')
			.split(/\r?\n+/)
			.map((line) => line.trim())
			.filter(Boolean)
	);
	onMount(() => {
		// Record exactly one visit per real page view (not hover-preload).
		fetch(`/api/visit/${book.bookid}`, { method: 'POST' }).catch(() => {});
	});
</script>

<Seo
	title={book.title}
	type="book"
	bookTitle={book.title}
	bookAuthor={book.author}
	isbn={book.isbn}
	description={book.intro?.slice(0, 140)}
	tags={book.tags}
	canonical={`${siteConfig.url}/books/${book.bookid}`}
/>

<PageHead
	kicker={`藏书 · 第 ${book.bookid} 号`}
	title={book.title}
	standfirst={`【${book.region}】${book.author}${book.copyrighter ? ` | ${book.copyrighter}` : ''}`}
	meta={visitLine}
/>

<div
	class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr] md:items-stretch lg:grid-cols-[340px_1fr]"
>
	<figure class="flex flex-col">
		<!-- Covers print in colour and at their natural ratio: all are 600px wide,
		     heights vary, so the width is fluid and the height follows the image. -->
		<img
			src={coverUrl(book.bookid)}
			alt={book.title}
			class="border-rule w-full border"
			decoding="async"
		/>
		<figcaption
			class="border-rule mt-auto flex items-baseline justify-between gap-2 border-t pt-1.5"
		>
			<span class="kicker text-ink-faint font-mono text-[0.625rem]">架位</span>
			<span class="text-spot font-mono text-xl leading-none font-bold tracking-[0.2em]">
				{book.location || '—'}
			</span>
		</figcaption>
	</figure>

	<!-- Ruled catalogue card: stretches to the cover's height, with the visit
	     log and tags pinned to the foot of the frame. -->
	<div class="border-rule-strong flex flex-col border px-4 py-3">
		<p class="text-sm">
			<span class="text-ink-faint">【{book.region}】</span><a
				href={authorSearchUrl(book.author)}
				class="hover:text-spot font-medium transition-colors hover:underline"
				title={`检索 ${book.author} 的全部藏书`}>{book.author}</a
			>{#if book.copyrighter}<span class="text-ink-faint"> | </span>{book.copyrighter}{/if}
		</p>

		<Ledger {rows} class="border-rule mt-3 border-t pt-3" />

		<div class="border-rule mt-auto border-t pt-3">
			<p class="text-ink-faint flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs">
				{#if visits}<span>访问 <b class="text-ink font-semibold tabular-nums">{visits}</b> 次</span
					>{/if}
				{#if lastVisit}<span
						>最近 <b class="text-ink font-semibold tabular-nums">{lastVisit}</b></span
					>{/if}
			</p>

			<div class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
				<span class="kicker text-ink-faint font-mono text-[0.625rem]">标签</span>
				<span class="flex-1">
					{#each tags as tag, index (tag)}
						{#if index > 0}<span class="text-ink-faint"> · </span>{/if}
						<a
							href={`/books/list/tags/${encodeURIComponent(tag)}/1`}
							class="text-spot hover:underline">{tag}</a
						>
					{/each}
					{#if !tags.length}<span class="text-ink-faint">—</span>{/if}
				</span>
			</div>

			<!-- Add tags: space separated (full-width spaces, commas and 、 too). -->
			<form
				class="mt-1.5 flex items-center gap-2"
				onsubmit={(event) => {
					event.preventDefault();
					saveTags();
				}}
			>
				<input
					bind:value={tagInput}
					placeholder="新标签，仅以空格分隔，单个 ≤30 字…"
					aria-label="新标签，仅以空格分隔，单个不超过三十字"
					maxlength="300"
					class="border-rule focus:border-spot placeholder:text-ink-faint w-full max-w-56 border-b bg-transparent py-0.5 font-mono text-xs outline-none"
				/>
				<button
					type="submit"
					disabled={tagBusy || !tagInput.trim()}
					class="hover:text-spot text-ink-faint inline-flex items-center gap-1 font-mono text-[0.625rem] transition-colors disabled:opacity-40"
				>
					{#if tagBusy}<Loader class="size-3 animate-spin" aria-hidden="true" />{/if}
					添加
				</button>
			</form>

			{#if tagNote}
				<p class="mt-1 font-mono text-[0.625rem] {tagError ? 'text-spot' : 'text-ink-faint'}">
					{tagNote}
				</p>
			{/if}
		</div>
	</div>
</div>

<!-- Two departments share one row on wide screens: the note sits in the left
     measure, the reviews take the remaining width — no dead space beside a
     short note. -->
<div
	class="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
>
	{#if book.intro}
		<section>
			<SectionHead kicker="藏书" title="简介" />
			<div class="text-[0.9375rem] leading-[1.9] [&>p+p]:mt-2">
				{#each introParagraphs as paragraph, index (index)}
					<p class="indent-[2em]">{paragraph}</p>
				{/each}
			</div>
		</section>
	{/if}

	<section class={book.intro ? '' : 'lg:col-span-2'}>
		<SectionHead
			kicker="读书"
			title="书评"
			meta={reviewCount ? `${reviewCount} 篇` : '暂无'}
			heavy={reviewCount > 0}
		/>

		{#if reviewCount}
			<ul class="divide-rule divide-y">
				{#each book.reviews as review (review.id)}
					<li class="py-3 first:pt-0 last:pb-0">
						<a href={review.uri} target="_blank" rel="noopener noreferrer" class="group flex gap-3">
							{#if review.feature}
								<img
									src={review.feature}
									alt=""
									loading="lazy"
									decoding="async"
									class="border-rule h-16 w-24 shrink-0 border object-cover grayscale transition group-hover:grayscale-0"
								/>
							{/if}
							<span class="min-w-0">
								<span class="group-hover:text-spot block font-medium transition-colors">
									{review.title}
								</span>
								<span class="text-ink-faint font-mono text-xs">{review.datein}</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-ink-faint text-sm">这本书还没有书评。</p>
		{/if}
	</section>
</div>
