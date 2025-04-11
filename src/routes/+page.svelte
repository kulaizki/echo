<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';

	let show: boolean = false;

	function blurFly(
		node: HTMLElement,
		params: {
			delay?: number;
			duration?: number;
			easing?: (t: number) => number;
		} = {}
	): {
		delay: number;
		duration: number;
		easing: (t: number) => number;
		css: (t: number) => string;
	} {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
		return {
			delay: params.delay || 0,
			duration: params.duration || 1500,
			easing: params.easing || cubicOut,
			css: (t: number) => `
        transform: ${existingTransform} translateY(${(1 - t) * 100}px);
        opacity: ${t};
        filter: blur(${(1 - t) * 10}px);
      `
		};
	}

	onMount(() => {
		show = true;
	});
</script>

<section class="flex-grow flex flex-col items-center justify-center p-8 text-white h-full">
	<div class="max-w-7xl md:max-w-4xl text-center" transition:blurFly>
		<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
			Hi i'm <span class="text-violet-400 [text-shadow:0_0_8px_rgba(202,139,244,0.5)]">Echo</span>.
		</h1>
		<p class="mb-6 text-lg text-gray-300 md:text-xl">your best buddy when it comes to mental wellness.</p>
	</div>
</section>
