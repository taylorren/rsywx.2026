<script lang="ts">
	import { cn } from '#lib/utils';

	export interface LedgerRow {
		label: string;
		value: string;
		unit?: string;
	}

	interface Props {
		rows: LedgerRow[];
		class?: string;
	}

	let { rows, class: className }: Props = $props();
</script>

<!-- Figures are set in mono with a dotted leader running to each label, the
     way a printed ledger or a contents page does it. -->
<dl class={cn('space-y-1.5', className)}>
	{#each rows as row (row.label)}
		<div class="flex items-baseline gap-2 text-sm">
			<dt class="text-ink-soft shrink-0">{row.label}</dt>
			<span class="leader-fill" aria-hidden="true"></span>
			<dd class="shrink-0 font-mono font-semibold tabular-nums">
				{row.value}
				{#if row.unit}
					<span class="text-ink-faint ml-0.5 text-xs font-normal">{row.unit}</span>
				{/if}
			</dd>
		</div>
	{/each}
</dl>
