<script lang="ts">
	import type { ChatMessage } from '$lib/../types';

	export let message: ChatMessage;
</script>

<div class={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
	<span
		class="inline-block max-w-[85%] px-3 py-2 rounded-lg
					 {message.role === 'user'
			? 'bg-teal-600 text-white'
			: 'bg-gray-700 text-gray-200'} break-words"
	>
		{message.text}
	</span>
</div> 