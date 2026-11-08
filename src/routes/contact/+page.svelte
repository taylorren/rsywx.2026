<script lang="ts">
	import { Mail } from '@lucide/svelte';
	import Seo from '#lib/components/seo.svelte';
	import PageHead from '#lib/components/paper/page-head.svelte';
</script>

<Seo title="联系站长" description="与任氏有无轩站长联系。" />

<PageHead kicker="通讯" title="联系站长" standfirst="此页正在建设中，更多联系方式稍后补充。" />

<p class="text-ink-soft mt-6 max-w-2xl leading-relaxed">
	在此之前，欢迎通过邮件与我联系。来信请注明来意，我会尽快回复。
</p>

<a
	href="mailto:taylor.ren@gmail.com"
	class="text-spot border-rule hover:border-spot mt-4 inline-flex items-center gap-2 border-b pb-1 font-mono text-sm transition-colors"
>
	<Mail class="size-4" aria-hidden="true" />
	taylor.ren@gmail.com
</a>
