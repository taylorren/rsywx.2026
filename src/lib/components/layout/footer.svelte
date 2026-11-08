<script lang="ts">
	import { siteConfig } from '#lib/config/site';

	const year = new Date().getFullYear();

	// The household, as printed in the colophon. Unlike the book plates, these
	// stay in full colour: they are the people, not the stock.
	const family = [
		{ file: 'tr.webp', alt: 'TR', title: 'TR the Father', caption: '父' },
		{ file: 'gr.webp', alt: 'GR', title: 'GR the Mother', caption: '母' },
		{ file: 'pr.webp', alt: 'PR', title: 'PR the Son', caption: '子' },
		{ file: 'rt.webp', alt: 'RT', title: 'Rafael the Tortoise', caption: '宠' }
	];
</script>

<!--
  Colophon: who holds the copyright, what the page is set in, and where the
  rest of the estate lives. Closed by a printer's line.
-->
<footer class="border-rule-strong mt-16 border-t-[3px] border-double">
	<div
		class="mx-auto grid max-w-[80rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10"
	>
		<div>
			<p class="font-display text-xl font-bold tracking-[0.14em]">{siteConfig.name}</p>
			<p class="text-ink-soft mt-2 text-xs">
				© {siteConfig.founded} – {year}
				<a href="/" class="hover:text-spot transition-colors">{siteConfig.name}</a>
			</p>
			<p class="text-ink-soft mt-1 text-xs">
				本站点按照
				<a
					href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-spot hover:underline">CC BY-NC-ND 4.0</a
				>
				许可证发布
			</p>
		</div>

		<div>
			<h2 class="kicker text-ink-faint font-mono text-[0.6875rem]">技术框架</h2>
			<ul class="text-ink-soft mt-2 space-y-1 text-xs">
				<li>
					前端
					<a
						href="https://svelte.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="text-spot hover:underline">SvelteKit</a
					>
				</li>
				<li>
					样式
					<a
						href="https://tailwindcss.com"
						target="_blank"
						rel="noopener noreferrer"
						class="text-spot hover:underline">Tailwind CSS</a
					>
				</li>
				<li>
					组件
					<a
						href="https://shadcn-svelte.com"
						target="_blank"
						rel="noopener noreferrer"
						class="text-spot hover:underline">shadcn-svelte</a
					>
				</li>
			</ul>
		</div>

		<div>
			<h2 class="kicker text-ink-faint font-mono text-[0.6875rem]">家庭成员</h2>
			<ul class="mt-2 flex flex-wrap items-start gap-3">
				{#each family as member (member.file)}
					<li>
						<figure>
							<img
								src={`/images/${member.file}`}
								alt={member.alt}
								title={member.title}
								loading="lazy"
								decoding="async"
								class="border-rule h-16 w-16 border object-cover"
							/>
							<figcaption class="text-ink-faint mt-1 text-center font-mono text-[0.625rem]">
								{member.caption}
							</figcaption>
						</figure>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<p
		class="border-rule text-ink-faint border-t px-4 py-4 text-center font-mono text-[0.625rem] sm:px-6 lg:px-10"
	>
		排印：宋体 · 朱砂一色 · 每日一期 · 通篇无圆角
	</p>
</footer>
