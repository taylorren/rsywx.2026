import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// SSR / dynamic app: a Node server (behind Apache/nginx, managed by pm2).
			adapter: adapter({ out: 'build', precompress: true })
		})
	],

	// Dev server: bind to all interfaces so the site is reachable over the LAN
	// (e.g. http://192.168.150.60:5173) and not just localhost.
	server: {
		host: true,
		port: 5173
	}
});
