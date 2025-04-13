import type { ChatMessage } from '$lib/../types';

export async function getChatReply(history: ChatMessage[]): Promise<string> {
	try {
		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ history: history })
		});
		if (!response.ok) {
			console.error(`HTTP error! status: ${response.status}`);
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		return result.reply;
	} catch (error) {
		console.error('Error fetching chat reply:', error);
		// Rethrow or return a specific error message
		throw error; // Or return "Sorry, I couldn't get a response."
	}
} 