<script lang="ts">
	import { siteConfig } from '#lib/config/site';

	const year = new Date().getFullYear();
</script>

<footer class="bg-muted/40 border-t">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<img src="/images/logo.svg" alt={siteConfig.name} class="size-8" width="32" height="32" />
					<a href="/" class="text-lg font-medium">{siteConfig.name}</a>
				</div>
				<p class="text-muted-foreground text-xs">
					© 1989 – {year} <a href="/">{siteConfig.name}</a>
				</p>
				<p class="text-muted-foreground text-xs">
					本站点按照
					<a
						href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
						class="text-blue-600 hover:underline dark:text-blue-400"
						target="_blank"
						rel="noopener noreferrer">CC BY-NC-ND 4.0</a
					>
					许可证发布
				</p>
			</div>

			<div class="space-y-3">
				<h3 class="text-sm font-semibold">技术框架</h3>
				<ul class="text-muted-foreground space-y-1 text-xs">
					<li>
						前端：
						<a
							href="https://svelte.dev"
							class="text-blue-600 hover:underline dark:text-blue-400"
							target="_blank"
							rel="noopener noreferrer">SvelteKit</a
						>
					</li>
					<li>
						CSS：
						<a
							href="https://tailwindcss.com"
							class="text-blue-600 hover:underline dark:text-blue-400"
							target="_blank"
							rel="noopener noreferrer">Tailwind CSS</a
						>
					</li>
					<li>
						UI：
						<a
							href="https://shadcn-svelte.com"
							class="text-blue-600 hover:underline dark:text-blue-400"
							target="_blank"
							rel="noopener noreferrer">shadcn-svelte</a
						>
					</li>
				</ul>
			</div>

			<div class="space-y-3">
				<h3 class="text-sm font-semibold">导航</h3>
				<ul class="text-muted-foreground space-y-1 text-xs">
					<li><a href="/books/list" class="hover:underline">藏书总目</a></li>
					<li><a href="/readings" class="hover:underline">读书</a></li>
					<li>
						<a
							href={siteConfig.links.blog}
							class="hover:underline"
							target="_blank"
							rel="noopener noreferrer">博客</a
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
