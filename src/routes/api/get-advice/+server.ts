import { json } from '@sveltejs/kit';
import { getGeminiAdvice } from '$lib/services/gemini-api';

export async function POST({ request }) {
  try {
    const { emotion, followUpResponses } = await request.json();

    if (!emotion || !followUpResponses) {
      return json({ error: 'Missing emotion or follow-up responses' }, { status: 400 });
    }

    const advice = await getGeminiAdvice(emotion, followUpResponses);

    return json({ advice });
  } catch (error) {
    console.error('API Route Error:', error);
    return json({ error: 'Failed to get advice' }, { status: 500 });
  }
} 