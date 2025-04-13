<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let isLoading = false;
	export let placeholder = 'Talk to Echo...';

	const dispatch = createEventDispatcher<{ submit: string }>();

	let textareaElement: HTMLTextAreaElement | null = null;

	function adjustTextareaHeight() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			const maxHeight = 150; 
			textareaElement.style.height = `${Math.min(textareaElement.scrollHeight, maxHeight)}px`;
		}
	}

	function handleSubmit() {
		if (!value.trim() || isLoading) return;
		dispatch('submit', value.trim());
		value = ''; // Clear input after submit
		requestAnimationFrame(adjustTextareaHeight); // Reset height after clearing
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}

	$: if (textareaElement && value === '') {
		requestAnimationFrame(adjustTextareaHeight);
	}
</script>

<div
	class="flex flex-row items-end gap-2
					 fixed bottom-0 left-0 right-0 p-3 bg-gray-900 border-t border-gray-700 z-20
					 sm:static sm:bottom-auto sm:left-auto sm:right-auto sm:w-full sm:p-1 sm:px-0 sm:bg-transparent sm:border-none sm:z-auto"
>
	<textarea
		bind:this={textareaElement}
		rows="1"
		bind:value
		{placeholder}
		on:input={adjustTextareaHeight}
		on:keydown={handleKeydown}
		class="flex-grow p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none overflow-y-auto max-h-[150px]"
		style="height: auto;"
	></textarea>
	<button
		aria-label="Send message"
		on:click={handleSubmit}
		disabled={!value.trim() || isLoading}
		class="flex-shrink-0 h-10 px-3 py-2 flex items-center justify-center rounded-lg bg-teal-600 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-send w-5 h-5"
		>
			<path d="m22 2-7 20-4-9-9-4Z" />
			<path d="M22 2 11 13" />
		</svg>
	</button>
</div> 