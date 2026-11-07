<script lang="ts">
	import { Card, CardContent } from '#lib/components/ui/card';

	interface Props {
		value: string | number;
		label: string;
		/**
		 * Literal Tailwind color classes for the value. Kept literal at the call
		 * site so Tailwind's scanner can detect the classes.
		 */
		valueClass?: string;
	}

	let { value, label, valueClass = 'text-amber-600 dark:text-amber-400' }: Props = $props();
</script>

<Card class="gap-0 py-4 text-center">
	<CardContent class="px-4">
		<div class="text-3xl font-bold {valueClass}">{value}</div>
		<div class="text-muted-foreground mt-1 text-sm">{label}</div>
	</CardContent>
</Card>
