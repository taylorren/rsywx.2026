<script lang="ts">
	import '../app.css';
	import Header from '#lib/components/layout/header.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>
