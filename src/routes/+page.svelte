<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import HappyButton from '$lib/components/emotions/happy-button.svelte';
	import SadButton from '$lib/components/emotions/sad-button.svelte';
	import AngryButton from '$lib/components/emotions/angry-button.svelte';
	import DisgustedButton from '$lib/components/emotions/disgusted-button.svelte';
	import AfraidButton from '$lib/components/emotions/afraid-button.svelte';
	import SurprisedButton from '$lib/components/emotions/surprised-button.svelte';
	import FollowUpQuestions from '$lib/components/follow-up-questions.svelte';
	import { slide, fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { onDestroy } from 'svelte';

	let show: boolean = false;
	let selectedEmotion: string | null = null;
	let showGreeting = true;
	let showFollowUp = false;
	let showChat = false;
	let chatHistory = writable<{ role: 'user' | 'model', text: string }[]>([]);
	let userMessage = '';
	let isChatLoading = false;
	let isLoading = false;
	let customFollowUpResponse = '';
	let chatContainer: HTMLElement | null = null;
	let unsubscribeChatHistory: (() => void) | null = null;

	const followUpQuestionsMap: Record<string, string[]> = {
		Happy: [
			'What specifically sparked this joy?',
			'Has this been a long time coming?',
			'How does this feeling manifest in your body?'
		],
		Sad: [
			'Has this feeling been recent?',
			'How intense is this sadness right now?',
			'Is there anything specific weighing on you?'
		],
		Angry: [
			'What triggered this anger?',
			'How strong is the feeling?',
			'Is it directed at someone or something?'
		],
		Disgusted: [
			'What caused this feeling of disgust?',
			'Is it related to a person, situation, or thought?',
			'How is this feeling affecting you?'
		],
		Afraid: [
			'What is the source of this fear?',
			'How immediate does the threat feel?',
			'What would help you feel safer?'
		],
		Surprised: [
			'Was it a pleasant or unpleasant surprise?',
			'Did it catch you completely off guard?',
			'How are you processing this surprise?'
		]
	};

	function selectEmotion(emotion: string) {
		selectedEmotion = emotion;
		showGreeting = false;
		showFollowUp = true;
		showChat = false;
		chatHistory.set([]);
		customFollowUpResponse = '';
	}

	async function handleFollowUpSubmit(questionContext?: string) {
		showFollowUp = false;
		showChat = true;
		isChatLoading = true;
		
		let initialUserText = customFollowUpResponse.trim();
		let firstMessageText = initialUserText;
		let contextForModel = `I'm feeling ${selectedEmotion}.`;

		if (questionContext) {
			contextForModel += ` I was asked: "${questionContext}". My response: "${initialUserText}".`;
		} else if (initialUserText) {
			contextForModel += ` I elaborated: "${initialUserText}".`;
		} else {
			contextForModel += ` Help me understand this feeling.`;
			firstMessageText = "(No specific details provided)";
		}
		
		chatHistory.set([
			{ role: 'user', text: firstMessageText },
			{ role: 'user', text: contextForModel }
		]);
		customFollowUpResponse = '';

		await fetchInitialChatResponse();
	}

	async function fetchInitialChatResponse() {
		try {
			const currentHistory = $chatHistory;
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ history: currentHistory })
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const result = await response.json();
			chatHistory.update(h => [...h, { role: 'model', text: result.reply }]);
		} catch (error) {
			console.error("Error starting chat:", error);
			chatHistory.update(h => [...h, { role: 'model', text: "Sorry, I'm having trouble starting our chat right now." }]);
		} finally {
			isChatLoading = false;
		}
	}

	async function sendChatMessage() {
		if (!userMessage.trim() || isChatLoading) return;

		const newUserMessage = { role: 'user' as const, text: userMessage.trim() };
		chatHistory.update(h => [...h, newUserMessage]);
		const messageToSend = userMessage.trim();
		userMessage = '';
		isChatLoading = true;

		try {
			const historyForApi = $chatHistory.filter((msg, index) => index !== 1);
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ history: historyForApi })
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const result = await response.json();
			chatHistory.update(h => [...h, { role: 'model', text: result.reply }]);
		} catch (error) {
			console.error("Error sending chat message:", error);
			chatHistory.update(h => [...h, { role: 'model', text: "Oops, something went wrong. Could you try saying that again?" }]);
		} finally {
			isChatLoading = false;
		}
	}

	function goBackToFollowUp() {
		showChat = false;
		showFollowUp = true;
		chatHistory.set([]);
	}

	function startOver() {
		selectedEmotion = null;
		showGreeting = true;
		showFollowUp = false;
		showChat = false;
		chatHistory.set([]);
		customFollowUpResponse = '';
		userMessage = '';
		isChatLoading = false;
	}

	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
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
		unsubscribeChatHistory = chatHistory.subscribe((value) => {
			if (showChat && chatContainer) {
				setTimeout(scrollToBottom, 0);
			}
		});
	});

	onDestroy(() => {
		if (unsubscribeChatHistory) {
			unsubscribeChatHistory();
		}
	});
</script>

<section class="flex-grow flex flex-col items-center justify-center p-8 h-full">
	<div class="w-full max-w-2xl md:max-w-3xl mx-auto" transition:blurFly>
		{#if showGreeting} 
			<div class="text-center" transition:fade={{ duration: 300 }}>
				<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-7xl">
					Hi, i'm <span class="text-teal-400 dark:[text-shadow:0_0_8px_rgba(45,212,191,0.5)] light:[text-shadow:0_0_8px_rgba(20,184,166,0.3)]">Echo</span>.
				</h1>
				<p class="mb-8 text-lg dark:text-gray-300 light:text-gray-600 md:text-xl">How are you feeling today?</p>
			</div>
		{/if}

		{#if !selectedEmotion}
			<div class="flex flex-wrap justify-center gap-4 mt-8 mb-8">
				<HappyButton onClick={() => selectEmotion('Happy')} />
				<SadButton onClick={() => selectEmotion('Sad')} />
				<AngryButton onClick={() => selectEmotion('Angry')} />
				<DisgustedButton onClick={() => selectEmotion('Disgusted')} />
				<AfraidButton onClick={() => selectEmotion('Afraid')} />
				<SurprisedButton onClick={() => selectEmotion('Surprised')} />
			</div>
		{/if}

		{#if selectedEmotion && showFollowUp}
			<div 
				class="w-full mt-6"
				transition:slide={{ duration: 300 }}
			>
				<FollowUpQuestions 
					questions={followUpQuestionsMap[selectedEmotion] || []}
					bind:customResponse={customFollowUpResponse}
					onCustomSubmit={handleFollowUpSubmit}
				/>
			</div>
		{/if}

		{#if selectedEmotion && showChat}
			<div class="mt-6 p-6 rounded-lg dark:bg-gray-800 light:bg-gray-100 border dark:border-teal-500 light:border-teal-400 shadow-lg w-full" transition:slide={{ duration: 300 }}>
				<div bind:this={chatContainer} class="flex flex-col h-[300px] overflow-y-auto mb-4 border dark:border-gray-600 light:border-gray-300 rounded p-3 space-y-3">
					{#each $chatHistory as message, index (index)}
						{#if index !== 1}
							<div class="{message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}">
								<span 
									class="inline-block max-w-[85%] px-3 py-2 rounded-lg 
												 {message.role === 'user' ? 'dark:bg-teal-600 light:bg-teal-500 text-white' : 'dark:bg-gray-700 light:bg-gray-200 dark:text-gray-200 light:text-gray-800'}"
								>
									{message.text}
								</span>
							</div>
						{/if}
					{/each}
					{#if isChatLoading}
						<div class="flex justify-start">
							<span class="inline-block px-3 py-2 rounded-lg dark:bg-gray-700 light:bg-gray-200 dark:text-gray-400 light:text-gray-500 animate-pulse">
								Echo is thinking...
							</span>
						</div>
					{/if}
				</div>
				<div class="flex flex-row items-center gap-2">
					<input
						type="text"
						bind:value={userMessage}
						placeholder="Talk to Echo..."
						on:keydown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
						class="flex-grow p-2 rounded-lg dark:bg-gray-700 light:bg-gray-200 dark:text-white light:text-gray-900 border dark:border-gray-600 light:border-gray-300 focus:outline-none focus:ring-2 dark:focus:ring-teal-400 light:focus:ring-teal-500 focus:border-transparent"
						/>
					<button
						on:click={sendChatMessage}
						disabled={!userMessage.trim() || isChatLoading}
						class="px-4 py-2 rounded-lg dark:bg-teal-600 light:bg-teal-500 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 dark:focus:ring-teal-400 light:focus:ring-teal-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Send
					</button>
				</div>
				<div class="mt-4 flex flex-col sm:flex-row gap-2">
					<button 
						on:click={goBackToFollowUp} 
						class="w-full sm:w-auto flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 dark:bg-gray-600 light:bg-gray-400 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 dark:focus:ring-gray-500 light:focus:ring-gray-500 focus:ring-opacity-75 cursor-pointer"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
						Back to Questions
					</button>
					<button 
						on:click={startOver}
						class="w-full sm:w-auto flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 dark:bg-red-600 light:bg-red-500 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 dark:focus:ring-red-400 light:focus:ring-red-500 focus:ring-opacity-75 cursor-pointer"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Start Over
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>
