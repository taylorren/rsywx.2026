<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import Seo from '#lib/components/seo.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
	import { siteConfig } from '#lib/config/site';
</script>

<Seo title="联系站长" description="任氏有无轩站长的联系方式：邮箱、X、Facebook、GitHub。" />

<PageHead kicker="通讯" title="联系站长" />

<!-- Four ruled rows, nothing else: label in the gutter, handle as the line of
     type, an arrow only where the link leaves the site. -->
<ul class="mt-8 max-w-xl">
	{#each siteConfig.social as row (row.label)}
		<li class="border-rule border-b">
			<a
				href={row.href}
				{...row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
				class="group flex items-baseline gap-4 py-3"
				title={row.external ? '在新窗口打开' : undefined}
			>
				<span class="text-ink-faint w-20 shrink-0 font-mono text-xs">{row.label}</span>
				<span
					class="font-display group-hover:text-spot flex-1 text-[0.9375rem] font-semibold transition-colors"
				>
					{row.handle}
				</span>
				{#if row.external}
					<ArrowUpRight
						class="text-ink-faint group-hover:text-spot size-4 shrink-0 transition-colors"
						aria-hidden="true"
					/>
				{/if}
			</a>
		</li>
	{/each}
</ul>
