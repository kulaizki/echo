<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Footer from '$lib/components/footer.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	
	let { children } = $props();
	
	onMount(() => {
	});
</script>

<svelte:head>
	<script>
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		
		if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
			document.documentElement.classList.add('light');
			document.documentElement.classList.remove('dark');
		} else {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		}
	</script>
</svelte:head>

<div class="flex flex-col min-h-screen relative">
	<div class="absolute top-4 right-4 z-10">
		<ThemeToggle />
	</div>
	
	<main class="flex-grow flex flex-col gradient-bg">
		{@render children()}
	</main>
	<Footer />
</div>