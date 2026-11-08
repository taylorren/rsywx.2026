<script lang="ts">
	import { Mail } from '@lucide/svelte';
	import Seo from '#lib/components/seo.svelte';
</script>

<Seo title="联系站长" description="与任氏有无轩站长联系。" />

<h1 class="text-3xl font-bold">联系站长</h1>

<p class="text-muted-foreground mt-4 leading-relaxed">
	此页面正在建设中，更多联系方式稍后补充。在此之前，欢迎通过邮件与我联系：
</p>

<a
	href="mailto:taylor.ren@gmail.com"
	class="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm transition-colors hover:bg-amber-400"
>
	<Mail class="size-4" />
	taylor.ren@gmail.com
</a>
