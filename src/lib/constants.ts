import type { FollowUpQuestionsMap } from '../types';

export const FOLLOW_UP_QUESTIONS: FollowUpQuestionsMap = {
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