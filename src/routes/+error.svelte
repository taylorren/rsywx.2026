<script lang="ts">
	import { House } from '@lucide/svelte';
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button';
</script>

<main class="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
	<p class="text-muted-foreground text-sm font-semibold">{page.status}</p>
	<h1 class="mt-2 text-3xl font-bold">出错了</h1>
	<p class="text-muted-foreground mt-3">{page.error?.message ?? '发生了未知错误'}</p>
	<Button href="/" class="mt-8"><House class="size-4" />返回首页</Button>
</main>
