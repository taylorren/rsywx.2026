<script lang="ts">
	import { BookOpen, Library } from '@lucide/svelte';
	import { onMount, type Component } from 'svelte';
	import { Button, type ButtonVariant } from '#lib/components/ui/button';

	interface Cta {
		href: string;
		label: string;
		variant?: ButtonVariant;
		icon?: Component;
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
		/** Background images cycled (crossfade) behind the hero. */
		images?: string[];
		/** Milliseconds between background changes. */
		interval?: number;
	}

	let {
		eyebrow = '个人数字图书馆',
		brand = '任氏有无轩',
		greeting = '欢迎您！',
		subtitle = '藏书 · 读书 · 博客 · 维客 · 资源',
		ctas = [
			{ href: '/books/list', label: '藏书总目', icon: Library },
			{ href: '/readings', label: '读书', variant: 'outline', icon: BookOpen }
		],
		images = ['/images/hannibal.webp', '/images/hilbert.webp', '/images/keynes.webp'],
		interval = 6000
	}: Props = $props();

	// Cycle the background images. Skipped for a single image, or when the user
	// prefers reduced motion.
	let active = $state(0);

	onMount(() => {
		if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}
		const id = setInterval(() => {
			active = (active + 1) % images.length;
		}, interval);
		return () => clearInterval(id);
	});
</script>

<section
	class="relative isolate flex min-h-[24rem] items-center overflow-hidden rounded-3xl border bg-neutral-900 sm:min-h-[28rem]"
>
	<!-- Rotating background images -->
	<div class="absolute inset-0" aria-hidden="true">
		{#each images as src, i (src)}
			<img
				{src}
				alt=""
				loading={i === 0 ? 'eager' : 'lazy'}
				decoding="async"
				class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out"
				class:opacity-100={i === active}
				class:opacity-0={i !== active}
			/>
		{/each}
		<!-- Scrim: keeps the text readable over any image -->
		<div class="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 w-full px-6 py-16 text-center sm:px-10 sm:py-24">
		<p class="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">{eyebrow}</p>

		<h1
			class="mt-4 text-4xl font-bold tracking-tight text-balance text-white drop-shadow-md sm:text-5xl lg:text-6xl"
		>
			<span class="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent"
				>{brand}</span
			>{greeting}
		</h1>

		<p class="mx-auto mt-5 max-w-2xl text-lg text-balance text-white/90 drop-shadow">
			{subtitle}
		</p>

		{#if ctas.length}
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				{#each ctas as cta (cta.href)}
					{@const Icon = cta.icon}
					<Button
						href={cta.href}
						size="lg"
						variant={cta.variant ?? 'default'}
						class={cta.variant === 'outline'
							? 'border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/70 dark:bg-transparent dark:hover:bg-white/10'
							: 'bg-white text-neutral-900 hover:bg-white/90 dark:bg-white dark:text-neutral-900 dark:hover:bg-white/90'}
					>
						{#if Icon}<Icon class="size-4" />{/if}
						{cta.label}
					</Button>
				{/each}
			</div>
		{/if}
	</div>
</section>
