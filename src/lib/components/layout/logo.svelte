<script lang="ts">
	import { cn } from '#lib/utils';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<!--
  The house seal. Printed with multiply so the reds sink into the newsprint
  instead of floating on top; purely decorative, the wordmark carries the name.
-->
<img
	src="/images/logo.svg"
	alt=""
	aria-hidden="true"
	decoding="async"
	class={cn('mix-blend-multiply select-none dark:mix-blend-normal', className)}
/>
