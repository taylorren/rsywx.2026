<script lang="ts">
	import { Button, type ButtonVariant } from '#lib/components/ui/button';

	interface Cta {
		href: string;
		label: string;
		variant?: ButtonVariant;
	}

	interface Props {
		/** Small uppercase label above the title. */
		eyebrow?: string;
		/** Brand name, rendered with the amber gradient highlight. */
		brand?: string;
		/** Text following the brand, inside the same heading. */
		greeting?: string;
		subtitle?: string;
		/** Call-to-action links rendered as buttons. */
		ctas?: Cta[];
	}

	let {
		eyebrow = '个人数字图书馆',
		brand = '任氏有无轩',
		greeting = '欢迎您！',
		subtitle = '藏书 · 读书 · 博客 · 维客 · 资源',
		ctas = [
			{ href: '/books/list', label: '浏览藏书总目' },
			{ href: '/readings', label: '读书', variant: 'outline' }
		]
	}: Props = $props();
</script>

<section
	class="via-background to-background relative overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-100/60 px-6 py-16 text-center sm:px-10 sm:py-24 dark:from-amber-950/40"
>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10"
	></div>

	<p class="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
		{eyebrow}
	</p>

	<h1 class="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
		<span
			class="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-300 dark:to-amber-500"
			>{brand}</span
		>{greeting}
	</h1>

	<p class="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg text-balance">
		{subtitle}
	</p>

	{#if ctas.length}
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			{#each ctas as cta (cta.href)}
				<Button href={cta.href} size="lg" variant={cta.variant ?? 'default'}>{cta.label}</Button>
			{/each}
		</div>
	{/if}
</section>
