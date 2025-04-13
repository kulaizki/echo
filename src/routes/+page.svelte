<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import HappyButton from '$lib/components/emotions/happy-button.svelte';
	import SadButton from '$lib/components/emotions/sad-button.svelte';
	import AngryButton from '$lib/components/emotions/angry-button.svelte';
	import FollowUpQuestions from '$lib/components/follow-up-questions.svelte';
	import { slide } from 'svelte/transition';

	let show: boolean = false;
	let selectedEmotion: string | null = null;
	let showFollowUp = false;
	let followUpResponses: string[] = [];
	let advice: string | null = null;
	let isLoading = false;

	const followUpOptions: Record<string, string[]> = {
		Happy: ['What made you feel this way?', 'Is there anything you want to celebrate?', 'How can you share this happiness?'],
		Sad: ['Just recently?', 'How long has it been?', 'Would you like to talk about it?'],
		Angry: ['What triggered this feeling?', 'Is this a recent feeling?', 'Do you need space or support?']
	};

	function selectEmotion(emotion: string) {
		selectedEmotion = emotion;
		showFollowUp = true;
		followUpResponses = []; 
		advice = null; 
	}

	async function handleFollowUpSelect(question: string) {
		followUpResponses = [...followUpResponses, question];
		
		if (selectedEmotion) {
			showFollowUp = false; 
			isLoading = true;
			advice = null;
			try {
				const response = await fetch('/api/get-advice', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ 
						emotion: selectedEmotion,
						followUpResponses: followUpResponses 
					})
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				advice = result.advice;
			} catch (error) {
				console.error('Error fetching advice:', error);
				advice = "Sorry, I couldn't get advice right now. Please try again later.";
			} finally {
				isLoading = false;
			}
		}
	}

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

<section class="flex-grow flex flex-col items-center justify-center p-8 h-full">
	<div class="max-w-2xl md:max-w-3xl text-center" transition:blurFly>
		<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
			Hi, i'm <span class="text-teal-400 dark:[text-shadow:0_0_8px_rgba(45,212,191,0.5)] light:[text-shadow:0_0_8px_rgba(20,184,166,0.3)]">Echo</span>.
		</h1>
		<p class="mb-8 text-lg dark:text-gray-300 light:text-gray-600 md:text-xl">How are you feeling today?</p>

		{#if !selectedEmotion}
			<div class="flex justify-center gap-4 mb-8">
				<HappyButton onClick={() => selectEmotion('Happy')} />
				<SadButton onClick={() => selectEmotion('Sad')} />
				<AngryButton onClick={() => selectEmotion('Angry')} />
			</div>
		{:else if showFollowUp}
			<div transition:slide={{ duration: 300 }}>
				<FollowUpQuestions 
					questions={followUpOptions[selectedEmotion] || []} 
					onSelect={handleFollowUpSelect} 
				/>
			</div>
		{/if}

		{#if isLoading}
			<div class="mt-6 p-4 rounded-lg dark:bg-gray-700 light:bg-gray-200 animate-pulse">
				<p class="dark:text-gray-400 light:text-gray-600">Echo is thinking...</p>
			</div>
		{:else if advice}
			<div 
				class="mt-6 p-6 rounded-lg dark:bg-gray-800 light:bg-gray-100 border dark:border-teal-500 light:border-teal-400 shadow-lg"
				transition:slide={{ duration: 300 }}
			>
				<p class="dark:text-gray-200 light:text-gray-800 whitespace-pre-wrap">{advice}</p>
				<button 
					on:click={() => { selectedEmotion = null; advice = null; showFollowUp = false; }}
					class="mt-4 px-4 py-2 rounded dark:bg-teal-600 light:bg-teal-500 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 dark:focus:ring-teal-400 light:focus:ring-teal-500 focus:ring-opacity-75"
				>
					Start Over
				</button>
			</div>
		{/if}
		
	</div>
</section>
