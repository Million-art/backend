export interface ConversationInterface {
  id: string;
  user: string;
  grammarMistakes: GrammarMistakeInterface[];
  lessons: LessonInterface[];
  chatHistory: ChatEntryInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GrammarMistakeInterface {
  mistake: string;
  correction: string;
  grammarType: string;
  createdAt: Date;
}

export interface LessonInterface {
  topic: string;
  details?: string;
  content?: string;
  createdAt: Date;
}

export interface ChatEntryInterface {
  userMessage: string;
  aiResponse: string;
  createdAt: Date;
}

export interface CreateConversationRequest {
  userId: string;
}

export interface AddGrammarMistakeRequest {
  mistake: string;
  correction: string;
  grammarType: string;
}

export interface AddLessonRequest {
  topic: string;
  details?: string;
  content?: string;
}

export interface AddChatEntryRequest {
  userMessage: string;
  aiResponse: string;
}
