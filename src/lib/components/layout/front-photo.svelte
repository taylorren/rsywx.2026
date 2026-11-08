<script lang="ts">
	import type { FrontPlate } from '#lib/config/site';

	interface Props {
		plate: FrontPlate;
	}

	let { plate }: Props = $props();
</script>

<!--
  The front-page plate. Greyscale plus a halftone dot screen, cropped to a
  fixed band biased toward the upper third so a portrait keeps its face.
-->
<figure>
	<div class="halftone h-52 w-full sm:h-64 lg:h-80">
		<img
			src={plate.src}
			alt={plate.caption}
			class="h-full w-full object-cover object-[50%_30%]"
			fetchpriority="high"
			decoding="async"
		/>
	</div>

	<figcaption class="border-rule mt-1.5 border-b pb-2 text-xs">
		<span class="text-spot font-mono font-semibold">本版图片</span>
		<span class="text-ink-soft ml-2">{plate.caption}</span>

		<blockquote class="text-ink mt-1.5 text-[0.9375rem] leading-relaxed italic">
			“{plate.quote}”
			<span class="text-ink-faint font-mono text-xs not-italic">—— {plate.source}</span>
		</blockquote>
	</figcaption>
</figure>
