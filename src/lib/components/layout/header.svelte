<script lang="ts">
	import { ExternalLink, Menu, Search, X } from '@lucide/svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { siteConfig } from '#lib/config/site';
	import { cn } from '#lib/utils';

	let mobileOpen = $state(false);
	let query = $state('');

	// Close the mobile menu after any navigation.
	afterNavigate(() => {
		mobileOpen = false;
	});

	/** Exact match on the home page, prefix match everywhere else. */
	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	function submitSearch(event: SubmitEvent) {
		const value = query.trim();
		if (!value) return;
		event.preventDefault();
		window.location.href = `/books/list/misc/${encodeURIComponent(value)}/1`;
	}
</script>

<!--
  The folio bar — the thin strip a newspaper runs above the front page. Nav is
  plain letter-spaced text with a spot-colour rule under the current section;
  no logo block, no pill buttons, no coloured CTA.
-->
<header
	class="bg-paper/95 border-rule supports-[backdrop-filter]:bg-paper/80 sticky top-0 z-50 border-b backdrop-blur"
>
	<nav class="mx-auto flex max-w-[80rem] items-center gap-4 px-4 sm:px-6 lg:px-10">
		<button
			type="button"
			onclick={() => (mobileOpen = !mobileOpen)}
			class="hover:text-spot inline-flex size-9 shrink-0 items-center justify-center transition-colors lg:hidden"
			aria-label="菜单"
			aria-expanded={mobileOpen}
		>
			{#if mobileOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
		</button>

		<a href="/" class="font-display shrink-0 text-base font-bold tracking-[0.2em] lg:hidden">
			{siteConfig.name}
		</a>

		<ul class="hidden items-center gap-6 lg:flex">
			{#each siteConfig.nav as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={isActive(link.href) ? 'page' : undefined}
						class={cn(
							'hover:text-spot border-b-2 border-transparent py-3 text-sm tracking-[0.14em] transition-colors',
							isActive(link.href) && 'border-spot text-spot'
						)}
					>
						{link.label}
					</a>
				</li>
			{/each}

			{#each siteConfig.external as link (link.href)}
				<li>
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						title="在新窗口打开"
						class="hover:text-spot inline-flex items-center gap-1 border-b-2 border-transparent py-3 text-sm tracking-[0.14em] transition-colors"
					>
						{link.label}
						<ExternalLink class="text-ink-faint size-3" aria-hidden="true" />
					</a>
				</li>
			{/each}

			<li>
				<a
					href={siteConfig.links.contact}
					class="text-spot hover:border-spot border-b-2 border-transparent py-3 text-sm tracking-[0.14em] transition-colors"
				>
					联系站长
				</a>
			</li>
		</ul>

		<div class="ml-auto flex items-center gap-3">
			<form onsubmit={submitSearch} class="hidden items-center gap-1.5 sm:flex">
				<Search class="text-ink-faint size-3.5" aria-hidden="true" />
				<input
					type="search"
					bind:value={query}
					placeholder="检索藏书"
					aria-label="检索藏书"
					class="border-rule focus:border-spot placeholder:text-ink-faint w-28 border-b bg-transparent py-1 text-sm transition-colors outline-none lg:w-40"
				/>
			</form>

			<ThemeToggle />
		</div>
	</nav>

	{#if mobileOpen}
		<div class="border-rule border-t lg:hidden">
			<ul class="divide-rule divide-y px-4 sm:px-6">
				{#each siteConfig.nav as link (link.href)}
					<li>
						<a
							href={link.href}
							class={cn(
								'block py-2.5 text-sm tracking-[0.14em]',
								isActive(link.href) && 'text-spot'
							)}>{link.label}</a
						>
					</li>
				{/each}

				{#each siteConfig.external as link (link.href)}
					<li>
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1.5 py-2.5 text-sm tracking-[0.14em]"
						>
							{link.label}
							<ExternalLink class="text-ink-faint size-3.5" aria-hidden="true" />
						</a>
					</li>
				{/each}

				<li>
					<a
						href={siteConfig.links.contact}
						class="text-spot block py-2.5 text-sm tracking-[0.14em]">联系站长</a
					>
				</li>
			</ul>

			<form
				onsubmit={submitSearch}
				class="border-rule flex items-center gap-2 border-t px-4 py-3 sm:px-6"
			>
				<Search class="text-ink-faint size-4" aria-hidden="true" />
				<input
					type="search"
					bind:value={query}
					placeholder="检索藏书"
					aria-label="检索藏书"
					class="border-rule focus:border-spot placeholder:text-ink-faint w-full border-b bg-transparent py-1 text-sm outline-none"
				/>
			</form>
		</div>
	{/if}
</header>
