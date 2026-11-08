<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '#lib/config/site';

	const status = $derived(page.status);
	const path = $derived(page.url.pathname);

	/**
	 * A miss under /books/<token> is a catalogue lookup — the record is absent or
	 * unshelved. Everything else (including /books/list/…) is a page that was
	 * never printed. The bare id and the .html form both land here.
	 */
	const bookToken = $derived.by(() => {
		const match = path.match(/^\/books\/([^/]+)$/);
		if (!match) return null;
		const token = match[1].replace(/\.html?$/i, '');
		if (token === 'list') return null;
		return token;
	});

	const isMissing = $derived(status === 404);
	const isBookMiss = $derived(isMissing && bookToken !== null);

	const kicker = $derived(!isMissing ? '版面 · 故障' : isBookMiss ? '藏书 · 缺号' : '版面 · 缺页');
	const headline = $derived(
		!isMissing ? '这一期出了点岔子' : isBookMiss ? '这一册不在架上' : '此页未印'
	);
</script>

<svelte:head>
	<title>{headline} | {siteConfig.name}</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="mx-auto max-w-3xl py-16 sm:py-24">
	<!-- Folio line: department on the left, status on the right -->
	<div class="border-rule flex items-baseline justify-between gap-4 border-b pb-1.5">
		<p class="kicker text-ink-faint font-mono text-xs">{kicker}</p>
		<p class="text-spot font-mono text-xs font-semibold tabular-nums">{status}</p>
	</div>

	<h1 class="font-display mt-6 text-4xl font-bold tracking-wide text-balance sm:text-5xl">
		{headline}
	</h1>

	<div class="border-rule-strong mt-4 border-t-[3px] border-double"></div>

	<div class="mt-8 grid gap-8 sm:grid-cols-[8rem_1fr] sm:items-start sm:gap-10">
		<!-- A plate that was never printed: hatched, with its caption. -->
		<figure class="w-32">
			<div
				class="border-rule-strong relative border {isBookMiss
					? 'aspect-3/4'
					: 'aspect-4/3'} bg-[repeating-linear-gradient(45deg,var(--color-rule)_0_1px,transparent_1px_7px)]"
				aria-hidden="true"
			>
				<span
					class="text-ink-faint absolute inset-0 flex items-center justify-center font-mono text-[0.625rem] tracking-[0.3em]"
				>
					{isMissing ? '缺' : '误'}
				</span>
			</div>
			<figcaption class="text-ink-faint mt-1.5 font-mono text-[0.625rem]">
				{isBookMiss ? '架位 --' : isMissing ? '缺页' : '故障'}
			</figcaption>
		</figure>

		<div class="text-ink-soft leading-relaxed">
			{#if !isMissing}
				<p>{page.error?.message ?? '发生了未知错误，请稍后再试。'}</p>
			{:else if isBookMiss}
				<p>
					书号 <span class="text-ink font-mono">{bookToken}</span>
					未在书目中，或该记录未入架（架位为
					<span class="font-mono">--</span>）。若书号无误，说明这一册尚未入库。
				</p>
				<p class="text-ink-faint mt-2 text-sm">
					书号形如 <span class="font-mono">00666</span>，五位数，前缀补零。
				</p>
			{:else}
				<p>
					地址 <span class="text-ink font-mono break-all">{path}</span> 不在本刊版面之列，或刊出后已撤版。
				</p>
			{/if}

			<p class="kicker text-ink-faint mt-6 font-mono text-[0.625rem]">可从下列版面继续</p>
			<ul class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
				<li><a href="/" class="text-spot hover:underline">首页 →</a></li>
				<li><a href="/books/list" class="text-spot hover:underline">藏书总目 →</a></li>
				<li><a href="/readings" class="text-spot hover:underline">读书笔记 →</a></li>
			</ul>
		</div>
	</div>
</div>
