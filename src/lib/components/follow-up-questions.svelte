<script lang="ts">
	import { fly } from 'svelte/transition';
	export let questions: string[] = [];
	export let customResponse: string = '';
	export let onCustomSubmit: (question?: string) => void = () => {};

	// Questions can have predefined answer options
	export let questionWithAnswers: Array<{ question: string, answers: string[] }> = [];
	
	// Selected question for showing answer options
	let selectedQuestionIndex: number | null = null;
	
	// Handle selecting a question to show answer options
	function selectQuestion(index: number) {
		selectedQuestionIndex = index;
		customResponse = ''; 
	}
	
	// Handle selecting an answer
	function selectAnswer(answer: string) {
		customResponse = answer;
		onCustomSubmit();
	}
</script>

<div class="p-4 rounded-lg bg-gray-800 border border-teal-500 shadow-lg">
	{#if selectedQuestionIndex === null}
		<h2 class="text-lg font-semibold mb-3 text-center">I'd like to know more</h2>
		<div class="space-y-2">
			{#each questions as question, i (question)}
				<button 
					in:fly={{ y: 20, duration: 200, delay: i * 50 }}
					on:click={() => selectQuestion(i)}
					class="w-full text-left p-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors duration-150 text-white border border-gray-600 flex items-center justify-between"
				>
					<span>{question}</span>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			{/each}
			
			{#if questionWithAnswers.length > 0}
				{#each questionWithAnswers as item, i (item.question)}
					<button 
						in:fly={{ y: 20, duration: 200, delay: (questions.length + i) * 50 }}
						on:click={() => selectQuestion(questions.length + i)}
						class="w-full text-left p-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors duration-150 text-white border border-gray-600 flex items-center justify-between"
					>
						<span>{item.question}</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{/each}
			{/if}
			
			<div 
				in:fly={{ y: 20, duration: 200, delay: (questions.length + questionWithAnswers.length) * 50 }}
				class="mt-4">
				<p class="text-sm mb-2 text-gray-300">Or share in your own words:</p>
				<textarea
					bind:value={customResponse}
					class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
					rows="3"
					placeholder="Tell Echo how you're feeling..."
				></textarea>
				<button
					on:click={() => onCustomSubmit()}
					disabled={!customResponse.trim()}
					class="mt-2 w-full px-4 py-2 rounded bg-teal-600 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Submit
				</button>
			</div>
		</div>
	{:else if selectedQuestionIndex !== null && selectedQuestionIndex < questions.length}
		<div class="space-y-3">
			<div class="flex items-center mb-3">
				<button 
					on:click={() => selectedQuestionIndex = null}
					class="mr-2 md:p-2 rounded hover:bg-gray-700"
					aria-label="Back"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<h2 class="text-md md:text-lg font-medium">{questions[selectedQuestionIndex]}</h2>
			</div>
			
			<textarea
				bind:value={customResponse}
				class="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
				rows="3"
				placeholder="Your answer..."
				on:keydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey && customResponse.trim()) {
						e.preventDefault(); 
						if (selectedQuestionIndex !== null) {
							onCustomSubmit(questions[selectedQuestionIndex]);
						}
					}
				}}
			></textarea>
			
			<div class="flex justify-between">
				<button
					on:click={() => selectedQuestionIndex = null}
					class="px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out"
				>
					Back
				</button>
				<button
					on:click={() => {
						if (selectedQuestionIndex !== null) {
							onCustomSubmit(questions[selectedQuestionIndex]);
						}
					}}
					disabled={!customResponse.trim()}
					class="px-4 py-2 rounded bg-teal-600 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Submit
				</button>
			</div>
		</div>
	{:else if selectedQuestionIndex !== null && selectedQuestionIndex >= questions.length}
		<div class="space-y-3">
			{#if questionWithAnswers.length > 0}
				<div class="flex items-center mb-3">
					<button 
						on:click={() => selectedQuestionIndex = null}
						class="mr-2 p-1 rounded hover:bg-gray-700"
						aria-label="Back"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<h2 class="text-lg font-semibold">{questionWithAnswers[selectedQuestionIndex - questions.length].question}</h2>
				</div>
				
				<div class="space-y-2">
					{#each questionWithAnswers[selectedQuestionIndex - questions.length].answers as answer}
						<button 
							on:click={() => selectAnswer(answer)}
							class="w-full text-left p-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors duration-150 text-white border border-gray-600 flex items-center justify-between"
						>
							<span>{answer}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</button>
					{/each}
				</div>
				
				<button
					on:click={() => selectedQuestionIndex = null}
					class="w-full px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:opacity-90 transition duration-150 ease-in-out"
				>
					Back
				</button>
			{/if}
		</div>
	{/if}
</div> 