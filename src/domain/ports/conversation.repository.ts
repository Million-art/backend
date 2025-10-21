import { ConversationEntity } from '../entities/conversation.entity';

export interface ConversationRepository {
  save(conversation: ConversationEntity): Promise<ConversationEntity>;
  findById(id: string): Promise<ConversationEntity | null>;
  findByUserId(userId: string): Promise<ConversationEntity | null>;
  findAll(): Promise<ConversationEntity[]>;
  update(id: string, conversation: Partial<ConversationEntity>): Promise<ConversationEntity | null>;
  delete(id: string): Promise<void>;
  addGrammarMistake(userId: string, mistake: any): Promise<ConversationEntity | null>;
  addLesson(userId: string, lesson: any): Promise<ConversationEntity | null>;
  addChatMessage(userId: string, chatEntry: any): Promise<ConversationEntity | null>;
}
