<script lang="ts">
	import { untrack } from 'svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import Box from '#lib/components/paper/box.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const audit = $derived(data.audit);
	const get = (key: string) => audit.tags.find((tag) => tag.key === key)?.content ?? null;

	/** Measured in the browser, because that is what a feed does with the file too. */
	let dims = $state<{ w: number; h: number } | null>(null);
	let broken = $state(false);

	function measure(event: Event) {
		const img = event.currentTarget as HTMLImageElement;
		dims = { w: img.naturalWidth, h: img.naturalHeight };
	}

	$effect(() => {
		void audit.path; // reset when the audited path changes
		untrack(() => {
			dims = null;
			broken = false;
		});
	});

	/** Every feed crops a large card to 1.91:1 — that is where covers get lost. */
	const SLOT = 1.91;
	const crop = $derived.by(() => {
		if (!dims?.w || !dims?.h) return null;
		const ratio = dims.w / dims.h;
		const visible = Math.min(1, ratio >= SLOT ? SLOT / ratio : ratio / SLOT);
		return { ratio, visible, lost: 1 - visible };
	});

	const jsonLd = $derived.by(() => {
		if (!audit.jsonLd) return null;
		try {
			return JSON.parse(audit.jsonLd) as Record<string, unknown>;
		} catch {
			return null;
		}
	});

	const checks = $derived([
		{ label: '页面返回 200', ok: audit.status === 200, note: `HTTP ${audit.status}` },
		{
			label: 'og:image 已声明',
			ok: Boolean(audit.imageHref),
			note: audit.imageHref ?? '缺失'
		},
		{
			label: '图片真的能打开',
			ok: Boolean(dims) && !broken,
			note: broken ? '打不开（404？）' : dims ? `${dims.w}×${dims.h}` : '测量中…'
		},
		{
			label: 'og:title / og:description',
			ok: Boolean(get('og:title')) && Boolean(get('og:description')),
			note: [get('og:title'), get('og:description')].filter(Boolean).join(' · ') || '缺失'
		},
		{
			label: 'twitter:card',
			ok: Boolean(get('twitter:card')),
			note: get('twitter:card') ?? '缺失'
		},
		{
			label: 'JSON-LD image',
			ok: typeof jsonLd?.image === 'string',
			note: typeof jsonLd?.image === 'string' ? jsonLd.image : '未声明'
		}
	]);

	const samples = ['/', '/books/00001.html', '/books/01779.html', '/readings', '/contact'];
</script>

<svelte:head>
	<title>分享卡预览 | 任氏有无轩</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<PageHead
	kicker="工具"
	title="分享卡预览"
	standfirst="读出任一页面实际发出的 og / twitter 标签，并按各平台的版式渲染出来。"
/>

<form class="mt-6 flex flex-wrap items-center gap-3" method="GET">
	<label class="text-ink-faint font-mono text-xs" for="url">页面</label>
	<input
		id="url"
		name="url"
		value={audit.path}
		class="border-rule text-ink focus-visible:border-spot min-w-72 flex-1 border-b bg-transparent py-1.5 font-mono text-sm outline-none"
		placeholder="/books/00001.html"
	/>
	<button
		type="submit"
		class="border-rule-strong kicker border px-4 py-1.5 font-mono text-xs hover:bg-black/5"
	>
		检查
	</button>
</form>

<div class="text-ink-faint mt-2 flex flex-wrap gap-x-4 font-mono text-[0.6875rem]">
	{#each samples as sample (sample)}
		<a class="hover:text-spot" href={`?url=${encodeURIComponent(sample)}`}>{sample}</a>
	{/each}
</div>

{#if audit.error}
	<p class="text-spot mt-6 font-mono text-sm">抓取失败：{audit.error}</p>
{/if}

<!-- Self-check: the same list a share debugger would give you. -->
<ul class="border-rule mt-8 divide-y divide-[var(--color-rule)] border-y">
	{#each checks as check (check.label)}
		<li class="flex items-start gap-3 py-2">
			<span
				class="mt-0.5 font-mono text-xs font-semibold {check.ok ? 'text-ink' : 'text-spot'}"
				aria-hidden="true">{check.ok ? '✓' : '✗'}</span
			>
			<span class="w-44 shrink-0 text-sm">{check.label}</span>
			<span class="text-ink-soft min-w-0 flex-1 font-mono text-xs break-all">{check.note}</span>
		</li>
	{/each}
</ul>

{#if crop && crop.lost > 0.02}
	<p class="text-spot mt-3 font-mono text-xs">
		注意：图片比例为 {crop.ratio.toFixed(2)}:1，大图卡是 1.91:1 —— 会裁掉约 {Math.round(
			crop.lost * 100
		)}% 的面积（{crop.visible < 0.6 ? '竖版封面基本只剩中间一条' : '影响有限'}）。
	</p>
{/if}

<!--
  The mockups use the real og:image and crop it with CSS — object-fit is exactly
  what a feed does to it, so this is the honest preview, not a drawing.
-->
<div class="mt-10 grid gap-8 lg:grid-cols-2">
	<figure>
		<figcaption class="kicker text-ink-faint mb-2 font-mono text-xs">
			X · 大图卡（summary_large_image，1.91:1）
		</figcaption>
		<div class="rounded-2xl border border-neutral-300 bg-white text-neutral-900">
			{#if audit.imageSrc}
				<img
					src={audit.imageSrc}
					alt=""
					class="aspect-[1.91/1] w-full rounded-t-2xl object-cover"
					onload={measure}
					onerror={() => (broken = true)}
				/>
			{:else}
				<div class="aspect-[1.91/1] w-full rounded-t-2xl bg-neutral-100"></div>
			{/if}
			<div class="px-3 py-2.5">
				<p class="text-[15px] leading-tight font-bold">{get('og:title') ?? '（无 og:title）'}</p>
				<p class="mt-1 line-clamp-2 text-sm text-neutral-500">
					{get('og:description') ?? '（无 og:description）'}
				</p>
				<p class="mt-2 text-xs text-neutral-500">rsywx.net</p>
			</div>
		</div>
	</figure>

	<figure>
		<figcaption class="kicker text-ink-faint mb-2 font-mono text-xs">
			X · 小卡（summary，1:1 缩略图）
		</figcaption>
		<div class="flex gap-3 rounded-2xl border border-neutral-300 bg-white p-3 text-neutral-900">
			{#if audit.imageSrc}
				<img src={audit.imageSrc} alt="" class="aspect-square w-30 rounded-xl object-cover" />
			{:else}
				<div class="aspect-square w-30 rounded-xl bg-neutral-100"></div>
			{/if}
			<div class="min-w-0">
				<p class="text-[15px] leading-tight font-bold">{get('og:title') ?? '（无 og:title）'}</p>
				<p class="mt-1 line-clamp-2 text-sm text-neutral-500">
					{get('og:description') ?? '（无 og:description）'}
				</p>
				<p class="mt-2 text-xs text-neutral-500">rsywx.net</p>
			</div>
		</div>
	</figure>

	<figure class="lg:col-span-2">
		<figcaption class="kicker text-ink-faint mb-2 font-mono text-xs">
			Facebook / Telegram / Slack（同样按 1.91:1 取图）
		</figcaption>
		<div class="max-w-140 border border-neutral-300 bg-white text-neutral-900">
			{#if audit.imageSrc}
				<img src={audit.imageSrc} alt="" class="aspect-[1.91/1] w-full object-cover" />
			{:else}
				<div class="aspect-[1.91/1] w-full bg-neutral-100"></div>
			{/if}
			<div class="border-t border-neutral-200 px-3 py-2">
				<p class="text-[11px] tracking-wider text-neutral-500 uppercase">rsywx.net</p>
				<p class="mt-0.5 text-base leading-tight font-bold">
					{get('og:title') ?? '（无 og:title）'}
				</p>
				<p class="mt-0.5 line-clamp-2 text-sm text-neutral-500">
					{get('og:description') ?? '（无 og:description）'}
				</p>
			</div>
		</div>
	</figure>
</div>

<div class="mt-10 grid gap-8 lg:grid-cols-2">
	<Box head="抓到的标签" meta={audit.imageSrc ? undefined : '无图'}>
		<dl class="mb-3 space-y-1 font-mono text-[0.6875rem]">
			<div class="flex gap-3">
				<dt class="text-ink-faint w-24 shrink-0">&lt;title&gt;</dt>
				<dd class="text-ink min-w-0 break-all">{audit.title ?? '（无）'}</dd>
			</div>
			<div class="flex gap-3">
				<dt class="text-ink-faint w-24 shrink-0">canonical</dt>
				<dd class="text-ink min-w-0 break-all">{audit.canonical ?? '（无）'}</dd>
			</div>
		</dl>
		<table class="w-full font-mono text-xs">
			<tbody>
				{#each audit.tags as tag (tag.key)}
					<tr class="border-rule border-b align-top last:border-0">
						<td class="text-ink-faint w-40 py-1 pr-3">{tag.key}</td>
						<td class="text-ink py-1 break-all">{tag.content}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Box>

	<Box head="JSON-LD">
		<pre
			class="overflow-x-auto font-mono text-[0.6875rem] leading-relaxed whitespace-pre-wrap">{jsonLd
				? JSON.stringify(jsonLd, null, 1)
				: '（无）'}</pre>
	</Box>
</div>
