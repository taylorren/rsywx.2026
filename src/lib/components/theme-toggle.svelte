<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun } from '@lucide/svelte';

	let isDark = $state(false);

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		try {
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		} catch {
			/* ignore (private mode) */
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	class="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
	aria-label="切换深浅色主题"
	title="切换主题"
>
	{#if isDark}
		<Sun class="size-5" />
	{:else}
		<Moon class="size-5" />
	{/if}
</button>
