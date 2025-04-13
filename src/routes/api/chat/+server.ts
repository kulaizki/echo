import { json } from '@sveltejs/kit';
import { getGeminiChatResponse } from '$lib/services/gemini-api'; // We'll create this function next

export async function POST({ request }) {
  try {
    const { history } = await request.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return json({ error: 'Missing or invalid chat history' }, { status: 400 });
    }

    const reply = await getGeminiChatResponse(history);

    return json({ reply });

  } catch (error) {
    console.error('API Chat Route Error:', error);
    return json({ error: 'Failed to get chat response' }, { status: 500 }); 
  }
} 