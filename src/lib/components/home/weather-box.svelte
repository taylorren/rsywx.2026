<script lang="ts">
	import Box from '#lib/components/paper/box.svelte';
	import Ledger from '#lib/components/paper/ledger.svelte';
	import type { CurrentWeather } from '#lib/types/api';

	interface Props {
		weather: CurrentWeather | null;
		error?: string | null;
	}

	let { weather, error = null }: Props = $props();

	/** "2026-11-08T13:48+08:00" -> "13:48" */
	const clock = $derived(weather?.update_time?.slice(11, 16) ?? undefined);

	const rows = $derived(
		weather
			? [
					{ label: '湿度', value: weather.humidity, unit: '%' },
					{ label: '气压', value: weather.pressure, unit: 'hPa' },
					{ label: '能见度', value: weather.visibility, unit: 'km' },
					{ label: '风速', value: weather.wind_speed, unit: 'km/h' }
				]
			: []
	);
</script>

<!-- Live conditions for the station the backend polls; figures set as a
     ledger, the temperature as the display figure. -->
<Box head="天气" meta={clock ? `更新 ${clock}` : undefined}>
	{#if weather}
		<div class="flex items-baseline gap-2">
			<span class="font-display text-3xl leading-none font-bold tabular-nums">
				{weather.temperature}°
			</span>
			<span class="text-sm">{weather.condition}</span>
		</div>
		<p class="text-ink-faint mt-1 font-mono text-xs">
			体感 {weather.feels_like}° · {weather.wind_direction}
			{weather.wind_scale} 级
		</p>
		<Ledger {rows} class="border-rule mt-3 border-t pt-3" />
	{:else}
		<p class="text-ink-faint text-sm">{error ?? '天气暂不可用'}</p>
	{/if}
</Box>
