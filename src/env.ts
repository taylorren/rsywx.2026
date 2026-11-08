import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Typed, validated environment variables (SvelteKit 3 `defineEnvVars`).
 *
 * Private variables (the default) are importable from `$app/env/private`, which
 * is a server-only module — the API key never reaches the browser bundle.
 */
export const variables = defineEnvVars({
	RSYWX_API_BASE_URL: {
		description: 'Base URL of the RSYWX API (…/api/v1).',
		schema: (value) =>
			value && value.length > 0 ? value.replace(/\/+$/, '') : 'http://localhost:8000/api/v1'
	},
	RSYWX_API_KEY: {
		description: 'API key sent as the X-API-Key header. Server-side use only.',
		schema: (value) => value ?? ''
	},
	RSYWX_TAG_EDIT: {
		description: 'Set to "off" to disable the tag editor (and its write route) entirely.',
		schema: (value) => (value === 'off' ? 'off' : 'on')
	}
});
