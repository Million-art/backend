import { ConversationInterface } from '../interfaces/conversation.interface';
import { v4 as uuidv4 } from 'uuid';

export class GrammarMistakeEntity {
  mistake: string;
  correction: string;
  grammarType: string;
  createdAt: Date;

  constructor(mistake: string, correction: string, grammarType: string, createdAt?: Date) {
    this.mistake = mistake;
    this.correction = correction;
    this.grammarType = grammarType;
    this.createdAt = createdAt || new Date();
  }
}

export class LessonEntity {
  topic: string;
  details?: string;
  content?: string;
  createdAt: Date;

  constructor(topic: string, details?: string, content?: string, createdAt?: Date) {
    this.topic = topic;
    this.details = details;
    this.content = content;
    this.createdAt = createdAt || new Date();
  }
}

export class ChatEntryEntity {
  userMessage: string;
  aiResponse: string;
  createdAt: Date;

  constructor(userMessage: string, aiResponse: string, createdAt?: Date) {
    this.userMessage = userMessage;
    this.aiResponse = aiResponse;
    this.createdAt = createdAt || new Date();
  }
}

export class ConversationEntity implements ConversationInterface {
  id: string;
  user: string;
  grammarMistakes: GrammarMistakeEntity[];
  lessons: LessonEntity[];
  chatHistory: ChatEntryEntity[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    user: string,
    grammarMistakes: GrammarMistakeEntity[] = [],
    lessons: LessonEntity[] = [],
    chatHistory: ChatEntryEntity[] = [],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.user = user;
    this.grammarMistakes = grammarMistakes;
    this.lessons = lessons;
    this.chatHistory = chatHistory;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(userId: string): ConversationEntity {
    return new ConversationEntity(uuidv4(), userId);
  }

  addGrammarMistake(mistake: string, correction: string, grammarType: string): ConversationEntity {
    const grammarMistake = new GrammarMistakeEntity(mistake, correction, grammarType);
    this.grammarMistakes.push(grammarMistake);
    this.updatedAt = new Date();
    return this;
  }

  addLesson(topic: string, details?: string, content?: string): ConversationEntity {
    const lesson = new LessonEntity(topic, details, content);
    this.lessons.push(lesson);
    this.updatedAt = new Date();
    return this;
  }

  addChatEntry(userMessage: string, aiResponse: string): ConversationEntity {
    const chatEntry = new ChatEntryEntity(userMessage, aiResponse);
    this.chatHistory.push(chatEntry);
    this.updatedAt = new Date();
    return this;
  }

  getRecentGrammarMistakes(limit: number = 50): GrammarMistakeEntity[] {
    return this.grammarMistakes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getRecentLessons(limit: number = 50): LessonEntity[] {
    return this.lessons
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getRecentChatHistory(limit: number = 50): ChatEntryEntity[] {
    return this.chatHistory
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
