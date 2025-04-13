<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { type Writable } from 'svelte/store';
	import type { ChatMessage } from '$lib/../types';
	import ChatMessageDisplay from './chat-message-display.svelte';
	import ChatInput from './chat-input.svelte';

	export let chatHistory: Writable<ChatMessage[]>;
	export let isChatLoading: boolean;
	export let onSendMessage: (message: string) => Promise<void>;
	export let onGoBack: () => void;
	export let onStartOver: () => void;

	let chatContainer: HTMLElement | null = null;
	let unsubscribeChatHistory: (() => void) | null = null;
	let userMessage = '';

	function scrollToBottom() {
		if (chatContainer) {
			setTimeout(() => {
				chatContainer!.scrollTop = chatContainer!.scrollHeight;
			}, 0);
		}
	}

	async function handleSendMessage(event: CustomEvent<string>) {
		const messageText = event.detail;
		// Optimistically add user message
		const newUserMessage = { role: 'user' as const, text: messageText };
		chatHistory.update((h) => [...h, newUserMessage]);
		await onSendMessage(messageText);
	}

	onMount(() => {
		unsubscribeChatHistory = chatHistory.subscribe((value) => {
			if (chatContainer) {
				scrollToBottom();
			}
		});
		scrollToBottom();
	});

	onDestroy(() => {
		if (unsubscribeChatHistory) {
			unsubscribeChatHistory();
		}
	});
	$: $chatHistory, scrollToBottom();
</script>

<div
	class="w-full flex flex-col rounded-lg md:bg-gray-800 md:border border-teal-500 md:shadow-lg sm:px-6 sm:py-6"
>
	<div
		class="sticky top-0 z-10
								 sm:static sm:p-0 sm:bg-transparent pb-4 border-b border-gray-700 mb-4 md:mb-4 md:pb-0 md:border-hidden"
	>
		<div class="flex gap-2">
			<button
				on:click={onGoBack}
				class="w-full sm:w-auto flex-1 p-3 sm:px-4 sm:py-2 rounded flex items-center justify-center gap-2 bg-gray-600 text-white font-medium hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 cursor-pointer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				<span class="hidden sm:inline">Back</span>
			</button>
			<button
				on:click={onStartOver}
				class="w-full sm:w-auto flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 bg-teal-700 text-white font-medium hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 cursor-pointer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				<span class="hidden sm:inline">Reset</span>
			</button>
		</div>
	</div>

	<div
		bind:this={chatContainer}
		class="flex-grow overflow-y-auto pb-20 sm:pb-0 md:border border-gray-600 rounded md:p-3 space-y-3
						 h-[calc(100vh-180px)] sm:h-[450px]"
	>
		{#each $chatHistory as message, index (index)}
			{#if index !== 1}
				<ChatMessageDisplay {message} />
			{/if}
		{/each}
		{#if isChatLoading}
			<div class="flex justify-start w-full">
				<span class="inline-block px-3 py-2 rounded-lg bg-gray-700 text-gray-400 animate-pulse">
					Echo is thinking...
				</span>
			</div>
		{/if}
	</div>

	<div class="w-full mt-2">
		<ChatInput bind:value={userMessage} isLoading={isChatLoading} on:submit={handleSendMessage} />
	</div>
</div>
