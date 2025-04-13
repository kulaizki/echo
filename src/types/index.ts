export type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Disgusted' | 'Afraid' | 'Surprised';

export interface ChatMessage {
	role: 'user' | 'model';
	text: string;
}

export type FollowUpQuestionsMap = Record<Emotion, string[]>; 