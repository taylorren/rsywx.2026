<script lang="ts">
	import { page } from '$app/state';
</script>

<main class="mx-auto max-w-2xl px-4 py-24 text-center">
	<p class="text-spot font-mono text-sm tabular-nums">{page.status}</p>

	<h1 class="font-display mt-3 text-6xl font-bold tracking-[0.14em]">出错了</h1>

	<div class="border-rule-strong mx-auto mt-6 w-24 border-t-[3px] border-double"></div>

	<p class="text-ink-soft mt-6 leading-relaxed">{page.error?.message ?? '发生了未知错误'}</p>

	<a
		href="/"
		class="text-spot hover:border-spot mt-10 inline-block border-b pb-1 font-mono text-sm transition-colors"
	>
		← 返回首页
	</a>
</main>
