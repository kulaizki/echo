<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/footer.svelte';
	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	<main class="flex-grow flex flex-col bg-gradient-to-br from-gray-950 via-gray-800 to-teal-800 md:to-teal-400 text-white">
		{@render children()}
	</main>
	<Footer />
</div>