<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { slide, fade } from 'svelte/transition';

	import HappyButton from '$lib/components/emotions/happy-button.svelte';
	import SadButton from '$lib/components/emotions/sad-button.svelte';
	import AngryButton from '$lib/components/emotions/angry-button.svelte';
	import DisgustedButton from '$lib/components/emotions/disgusted-button.svelte';
	import AfraidButton from '$lib/components/emotions/afraid-button.svelte';
	import SurprisedButton from '$lib/components/emotions/surprised-button.svelte';
	import FollowUpQuestions from '$lib/components/follow-up-questions.svelte';
	import ChatWindow from '$lib/components/chat/chat-window.svelte';

	import { FOLLOW_UP_QUESTIONS } from '$lib/constants';
	import { getChatReply } from '$lib/services/chat-service';
	import { blurFly } from '$lib/utils/transitions';
	import type { Emotion, ChatMessage } from '$lib/../types';

	type Stage = 'greeting' | 'followUp' | 'chat';

	let stage: Stage = 'greeting';
	let selectedEmotion: Emotion | null = null;
	let customFollowUpResponse = '';
	let isChatLoading = false;
	let showComponent = false; 

	const chatHistory: Writable<ChatMessage[]> = writable([]);

	function selectEmotionHandler(emotion: Emotion) {
		selectedEmotion = emotion;
		stage = 'followUp';
		chatHistory.set([]);
		customFollowUpResponse = '';
	}

	async function handleFollowUpSubmit(questionContext?: string) {
		stage = 'chat';
		isChatLoading = true;

		const initialUserText = customFollowUpResponse.trim();
		let firstMessageText = initialUserText;
		let contextForModel = `I'm feeling ${selectedEmotion}.`;

		if (questionContext) {
			contextForModel += ` I was asked: "${questionContext}". My response: "${initialUserText}".`;
		} else if (initialUserText) {
			contextForModel += ` I elaborated: "${initialUserText}".`;
		} else {
			// If no specific details, use a default prompt
			contextForModel += ` Help me understand this feeling.`;
			firstMessageText = '(No specific details provided)'; 
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
			const reply = await getChatReply(currentHistory);
			chatHistory.update((h) => [...h, { role: 'model', text: reply }]);
		} catch (error) {
			console.error('Error starting chat:', error);
			chatHistory.update((h) => [
				...h,
				{ role: 'model', text: "Sorry, I'm having trouble starting our chat right now." }
			]);
		} finally {
			isChatLoading = false;
		}
	}

	async function sendChatMessage(messageText: string) {
		if (!messageText || isChatLoading) return;

		isChatLoading = true;

		try {
			// The ChatWindow component already added the user message optimistically
			// We only need the history up to the latest user message for the API call
			const historyForApi = $chatHistory.filter((msg, index) => index !== 1); // Exclude context
			const reply = await getChatReply(historyForApi);
			chatHistory.update((h) => [...h, { role: 'model', text: reply }]);
		} catch (error) {
			console.error('Error sending chat message:', error);
			chatHistory.update((h) => [
				...h,
				{ role: 'model', text: 'Oops, something went wrong. Could you try saying that again?' }
			]);
		} finally {
			isChatLoading = false;
		}
	}

	function goBackToFollowUp() {
		stage = 'followUp';
		chatHistory.set([]); // Clear chat history when going back
	}

	function startOver() {
		selectedEmotion = null;
		stage = 'greeting';
		chatHistory.set([]);
		customFollowUpResponse = '';
		isChatLoading = false;
	}

	onMount(() => {
		showComponent = true; 
	});
</script>

<section
	class="flex-grow flex flex-col items-center p-4 sm:p-8 h-full"
	class:justify-center={stage !== 'chat'}
>
	{#if showComponent}
		<div
			class="w-full sm:max-w-2xl md:max-w-3xl sm:mx-auto flex flex-col"
			class:h-full={stage === 'chat'}
			in:blurFly
		>
			{#if stage === 'greeting'}
				<div class="text-center" transition:fade={{ duration: 300 }}>
					<h1 class="mb-6 text-4xl font-bold tracking-tight md:text-7xl">
						Hi, I'm <span
							class="text-teal-400 dark:[text-shadow:0_0_8px_rgba(45,212,191,0.5)] light:[text-shadow:0_0_8px_rgba(20,184,166,0.3)]"
							>Echo</span
						>.
					</h1>
					<p class="mb-4 text-lg dark:text-gray-300 light:text-gray-600 md:text-xl">
						How are you feeling today?
					</p>
				</div>
			{/if}

			{#if !selectedEmotion}
				<!-- Emotion Selection -->
				<div class="flex flex-wrap justify-center gap-4 mt-8 mb-8">
					<HappyButton onClick={() => selectEmotionHandler('Happy')} />
					<SadButton onClick={() => selectEmotionHandler('Sad')} />
					<AngryButton onClick={() => selectEmotionHandler('Angry')} />
					<DisgustedButton onClick={() => selectEmotionHandler('Disgusted')} />
					<AfraidButton onClick={() => selectEmotionHandler('Afraid')} />
					<SurprisedButton onClick={() => selectEmotionHandler('Surprised')} />
				</div>
			{:else if stage === 'followUp'}
				<!-- Follow-up Questions -->
				<div class="w-full mt-6" transition:slide={{ duration: 300 }}>
					<FollowUpQuestions
						questions={FOLLOW_UP_QUESTIONS[selectedEmotion] || []}
						bind:customResponse={customFollowUpResponse}
						onCustomSubmit={handleFollowUpSubmit}
					/>
				</div>
			{:else if stage === 'chat'}
				<!-- Chat Window -->
				<div class="w-full h-full" transition:slide={{ duration: 300 }}>
					<ChatWindow
						{chatHistory}
						{isChatLoading}
						onSendMessage={sendChatMessage}
						onGoBack={goBackToFollowUp}
						onStartOver={startOver}
					/>
				</div>
			{/if}
		</div>
	{/if}
</section>
