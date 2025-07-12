<script lang="ts">
	import { Input } from '$lib/components/ui/input/index';
	let value = $state('');
</script>

<Input {value} onchange={(e: Event) => (value = (e.currentTarget as HTMLInputElement).value)} />
