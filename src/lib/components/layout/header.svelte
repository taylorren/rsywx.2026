<script lang="ts">
	import { Menu, Search, X } from '@lucide/svelte';
	import { afterNavigate } from '$app/navigation';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { siteConfig } from '#lib/config/site';

	let mobileOpen = $state(false);
	let query = $state('');

	const navLinks = [
		{ href: '/', label: '首页' },
		{ href: '/books/list', label: '藏书总目' },
		{ href: '/readings', label: '读书' }
	];

	// Close the mobile menu after any navigation.
	afterNavigate(() => {
		mobileOpen = false;
	});

	function submitSearch(event: SubmitEvent) {
		const value = query.trim();
		if (!value) return;
		event.preventDefault();
		window.location.href = `/books/list/misc/${encodeURIComponent(value)}/1`;
	}
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur"
>
	<nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
		<a href="/" class="flex items-center gap-3">
			<img src="/images/logo.svg" alt={siteConfig.name} class="size-9" width="36" height="36" />
			<span class="text-lg font-bold tracking-tight">{siteConfig.name}</span>
		</a>

		<!-- Desktop nav -->
		<div class="hidden items-center gap-1 md:flex">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
				>
					{link.label}
				</a>
			{/each}
			<a
				href={siteConfig.links.blog}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
				>博客</a
			>
			<a
				href={siteConfig.links.wiki}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
				>维客</a
			>
		</div>

		<div class="flex items-center gap-2">
			<form onsubmit={submitSearch} class="relative hidden sm:block">
				<Search
					class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
				/>
				<input
					type="search"
					bind:value={query}
					placeholder="搜索藏书…"
					aria-label="搜索藏书"
					class="bg-background focus-visible:ring-ring h-9 w-44 rounded-md border pr-3 pl-8 text-sm outline-none focus-visible:ring-2 lg:w-56"
				/>
			</form>

			<ThemeToggle />

			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				class="hover:bg-accent inline-flex size-9 items-center justify-center rounded-md md:hidden"
				aria-label="菜单"
			>
				{#if mobileOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
			</button>
		</div>
	</nav>

	{#if mobileOpen}
		<div class="border-t md:hidden">
			<div class="space-y-1 px-4 py-3">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="hover:bg-accent block rounded-md px-3 py-2 text-base font-medium">{link.label}</a
					>
				{/each}
				<a
					href={siteConfig.links.blog}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:bg-accent block rounded-md px-3 py-2 text-base font-medium">博客</a
				>
				<a
					href={siteConfig.links.wiki}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:bg-accent block rounded-md px-3 py-2 text-base font-medium">维客</a
				>
			</div>
		</div>
	{/if}
</header>
