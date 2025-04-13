<script lang="ts">
	import type { ChatMessage } from '$lib/../types';

	export let message: ChatMessage;
</script>

<div class={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
	<span
		class="inline-block max-w-[85%] px-3 py-2 rounded-lg
					 {message.role === 'user'
			? 'dark:bg-teal-600 light:bg-teal-500 text-white'
			: 'dark:bg-gray-700 light:bg-gray-200 dark:text-gray-200 light:text-gray-800'} break-words"
	>
		{message.text}
	</span>
</div> 